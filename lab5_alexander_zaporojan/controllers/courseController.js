const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { sequelize, Teacher, Course } = require('../models');
const { logAdminAction } = require('../middleware/logger');

async function getCourses(req, res, next) {
    try {
        const search = req.query.search || '';
        const teacherId = req.query.teacherId || '';
        const semester = req.query.semester || '';
        const where = {};

        if (search) {
            where.title = { [Op.iLike]: '%' + search + '%' };
        }

        if (Number.isInteger(Number(teacherId)) && teacherId !== '') {
            where.teacherId = Number(teacherId);
        }

        if (Number.isInteger(Number(semester)) && semester !== '') {
            where.semester = Number(semester);
        }

        const courses = await Course.findAll({
            where: where,
            include: Teacher,
            order: [['id', 'ASC']]
        });

        const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });

        res.render('courses/index', {
            courses: courses,
            teachers: teachers,
            search: search,
            teacherId: teacherId,
            semester: semester
        });
    } catch (error) {
        next(error);
    }
}

async function showCreateForm(req, res, next) {
    try {
        const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
        res.render('courses/create', { course: {}, teachers: teachers, errors: [] });
    } catch (error) {
        next(error);
    }
}

async function createCourse(req, res, next) {
    try {
        const errors = validationResult(req).array().map((e) => e.msg);
        let teacher = null;

        if (errors.length === 0) {
            teacher = await Teacher.findByPk(req.body.teacherId);

            if (!teacher) {
                errors.push('Выбранный преподаватель не существует');
            }
        }

        if (errors.length > 0) {
            const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
            return res.status(400).render('courses/create', { course: req.body, teachers: teachers, errors: errors });
        }

        const course = await Course.create({
            title: req.body.title,
            credits: Number(req.body.credits),
            semester: Number(req.body.semester),
            description: req.body.description,
            teacherId: Number(req.body.teacherId)
        });

        logAdminAction(req, 'CREATE', 'Course', course.id);

        const io = req.app.get('io');
        io.emit('courseCreated', {
            title: course.title,
            teacher: teacher.name,
            time: new Date().toLocaleTimeString('ru-RU')
        });

        res.redirect('/courses');
    } catch (error) {
        next(error);
    }
}

async function getCourseById(req, res, next) {
    try {
        const course = await Course.findByPk(req.params.id, { include: Teacher });

        if (!course) {
            const error = new Error('Курс не найден');
            error.status = 404;
            return next(error);
        }

        res.render('courses/details', { course: course });
    } catch (error) {
        next(error);
    }
}

async function showEditForm(req, res, next) {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            const error = new Error('Курс не найден');
            error.status = 404;
            return next(error);
        }

        const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
        res.render('courses/edit', { course: course, teachers: teachers, errors: [] });
    } catch (error) {
        next(error);
    }
}

async function updateCourse(req, res, next) {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            const error = new Error('Курс не найден');
            error.status = 404;
            return next(error);
        }

        const errors = validationResult(req).array().map((e) => e.msg);

        if (errors.length === 0) {
            const teacher = await Teacher.findByPk(req.body.teacherId);

            if (!teacher) {
                errors.push('Выбранный преподаватель не существует');
            }
        }

        if (errors.length > 0) {
            const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
            req.body.id = course.id;
            return res.status(400).render('courses/edit', { course: req.body, teachers: teachers, errors: errors });
        }

        await course.update({
            title: req.body.title,
            credits: Number(req.body.credits),
            semester: Number(req.body.semester),
            description: req.body.description,
            teacherId: Number(req.body.teacherId)
        });

        logAdminAction(req, 'UPDATE', 'Course', course.id);
        res.redirect('/courses/' + course.id);
    } catch (error) {
        next(error);
    }
}

async function deleteCourse(req, res, next) {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            const error = new Error('Курс не найден');
            error.status = 404;
            return next(error);
        }

        const id = course.id;
        await course.destroy();
        logAdminAction(req, 'DELETE', 'Course', id);
        res.redirect('/courses');
    } catch (error) {
        next(error);
    }
}

async function getStatistics(req, res, next) {
    try {
        const teachersCount = await Teacher.count();
        const coursesCount = await Course.count();

        const semesters = await Course.findAll({
            attributes: ['semester', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['semester'],
            order: [['semester', 'ASC']],
            raw: true
        });

        const teachers = await Teacher.findAll({
            include: Course,
            order: [['name', 'ASC']]
        });

        let topTeacher = null;
        for (const teacher of teachers) {
            if (teacher.Courses.length > 0) {
                if (!topTeacher || teacher.Courses.length > topTeacher.Courses.length) {
                    topTeacher = teacher;
                }
            }
        }

        res.render('statistics', {
            teachersCount: teachersCount,
            coursesCount: coursesCount,
            semesters: semesters,
            teachers: teachers,
            topTeacher: topTeacher
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getCourses,
    showCreateForm,
    createCourse,
    getCourseById,
    showEditForm,
    updateCourse,
    deleteCourse,
    getStatistics
};
