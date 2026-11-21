function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    next();
}

function isAdmin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (req.session.user.role !== 'admin') {
        const error = new Error('Недостаточно прав');
        error.status = 403;
        return next(error);
    }

    next();
}

module.exports = { isAuthenticated, isAdmin };
