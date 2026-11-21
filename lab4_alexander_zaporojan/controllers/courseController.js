const { Op } = require('sequelize');
const { sequelize, Teacher, Course } = require('../models');

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
        await Course.create({
            title: req.body.title.trim(),
            credits: Number(req.body.credits),
            semester: Number(req.body.semester),
            description: req.body.description.trim(),
            teacherId: Number(req.body.teacherId)
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
            return res.status(404).render('404', { url: req.originalUrl });
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
            return res.status(404).render('404', { url: req.originalUrl });
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
            return res.status(404).render('404', { url: req.originalUrl });
        }

        await course.update({
            title: req.body.title.trim(),
            credits: Number(req.body.credits),
            semester: Number(req.body.semester),
            description: req.body.description.trim(),
            teacherId: Number(req.body.teacherId)
        });

        res.redirect('/courses/' + course.id);
    } catch (error) {
        next(error);
    }
}

async function deleteCourse(req, res, next) {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).render('404', { url: req.originalUrl });
        }

        await course.destroy();
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
