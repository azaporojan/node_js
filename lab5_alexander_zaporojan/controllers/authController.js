const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { User } = require('../models');

function showRegisterForm(req, res) {
    res.render('auth/register', { name: '', email: '', errors: [] });
}

async function register(req, res, next) {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const result = validationResult(req);

        if (!result.isEmpty()) {
            const errors = result.array().map((e) => e.msg);
            return res.status(400).render('auth/register', { name: name, email: email, errors: errors });
        }

        const existing = await User.findOne({ where: { email: email } });

        if (existing) {
            return res.status(409).render('auth/register', {
                name: name,
                email: email,
                errors: ['Пользователь с таким email уже зарегистрирован']
            });
        }

        const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(req.body.password, rounds);

        await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        res.redirect('/login');
    } catch (error) {
        next(error);
    }
}

function showLoginForm(req, res) {
    res.render('auth/login', { email: '', errors: [] });
}

async function login(req, res, next) {
    try {
        const email = req.body.email;
        const result = validationResult(req);

        if (!result.isEmpty()) {
            const errors = result.array().map((e) => e.msg);
            return res.status(400).render('auth/login', { email: email, errors: errors });
        }

        const user = await User.findOne({ where: { email: email } });
        let passwordIsCorrect = false;

        if (user) {
            passwordIsCorrect = await bcrypt.compare(req.body.password, user.password);
        }

        if (!user || !passwordIsCorrect) {
            return res.status(401).render('auth/login', {
                email: email,
                errors: ['Неверный email или пароль']
            });
        }

        await user.update({ lastLogin: new Date() });

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.redirect('/profile');
    } catch (error) {
        next(error);
    }
}

function logout(req, res, next) {
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
}

async function getProfile(req, res, next) {
    try {
        const user = await User.findByPk(req.session.user.id);

        if (!user) {
            return res.redirect('/login');
        }

        res.render('profile', { user: user });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    showRegisterForm,
    register,
    showLoginForm,
    login,
    logout,
    getProfile
};
