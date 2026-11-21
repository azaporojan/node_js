const { validationResult } = require('express-validator');
const { Teacher, Course } = require('../models');
const { logAdminAction } = require('../middleware/logger');

async function getTeachers(req, res, next) {
    try {
        const teachers = await Teacher.findAll({
            include: Course,
            order: [['id', 'ASC']]
        });

        res.render('teachers/index', { teachers: teachers });
    } catch (error) {
        next(error);
    }
}

function showCreateForm(req, res) {
    res.render('teachers/create', { teacher: {}, errors: [] });
}

async function createTeacher(req, res, next) {
    try {
        const errors = validationResult(req).array().map((e) => e.msg);

        if (errors.length > 0) {
            return res.status(400).render('teachers/create', { teacher: req.body, errors: errors });
        }

        const existing = await Teacher.findOne({ where: { email: req.body.email } });

        if (existing) {
            return res.status(409).render('teachers/create', {
                teacher: req.body,
                errors: ['Преподаватель с таким email уже существует']
            });
        }

        const teacher = await Teacher.create({
            name: req.body.name,
            email: req.body.email,
            department: req.body.department,
            academicDegree: req.body.academicDegree
        });

        logAdminAction(req, 'CREATE', 'Teacher', teacher.id);
        res.redirect('/teachers');
    } catch (error) {
        next(error);
    }
}

async function getTeacherById(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id, { include: Course });

        if (!teacher) {
            const error = new Error('Преподаватель не найден');
            error.status = 404;
            return next(error);
        }

        res.render('teachers/details', { teacher: teacher, error: null });
    } catch (error) {
        next(error);
    }
}

async function showEditForm(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id);

        if (!teacher) {
            const error = new Error('Преподаватель не найден');
            error.status = 404;
            return next(error);
        }

        res.render('teachers/edit', { teacher: teacher, errors: [] });
    } catch (error) {
        next(error);
    }
}

async function updateTeacher(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id);

        if (!teacher) {
            const error = new Error('Преподаватель не найден');
            error.status = 404;
            return next(error);
        }

        const errors = validationResult(req).array().map((e) => e.msg);
        req.body.id = teacher.id;

        if (errors.length > 0) {
            return res.status(400).render('teachers/edit', { teacher: req.body, errors: errors });
        }

        const existing = await Teacher.findOne({ where: { email: req.body.email } });

        if (existing && existing.id !== teacher.id) {
            return res.status(409).render('teachers/edit', {
                teacher: req.body,
                errors: ['Преподаватель с таким email уже существует']
            });
        }

        await teacher.update({
            name: req.body.name,
            email: req.body.email,
            department: req.body.department,
            academicDegree: req.body.academicDegree
        });

        logAdminAction(req, 'UPDATE', 'Teacher', teacher.id);
        res.redirect('/teachers/' + teacher.id);
    } catch (error) {
        next(error);
    }
}

async function deleteTeacher(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id, { include: Course });

        if (!teacher) {
            const error = new Error('Преподаватель не найден');
            error.status = 404;
            return next(error);
        }

        if (teacher.Courses.length > 0) {
            return res.status(400).render('teachers/details', {
                teacher: teacher,
                error: 'Невозможно удалить преподавателя, у которого есть курсы'
            });
        }

        const id = teacher.id;
        await teacher.destroy();
        logAdminAction(req, 'DELETE', 'Teacher', id);
        res.redirect('/teachers');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTeachers,
    showCreateForm,
    createTeacher,
    getTeacherById,
    showEditForm,
    updateTeacher,
    deleteTeacher
};
