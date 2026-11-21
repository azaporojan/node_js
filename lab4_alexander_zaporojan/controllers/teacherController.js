const { Teacher, Course } = require('../models');

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
        await Teacher.create({
            name: req.body.name.trim(),
            email: req.body.email.trim(),
            department: req.body.department.trim(),
            academicDegree: req.body.academicDegree.trim()
        });

        res.redirect('/teachers');
    } catch (error) {
        next(error);
    }
}

async function getTeacherById(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id, { include: Course });

        if (!teacher) {
            return res.status(404).render('404', { url: req.originalUrl });
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
            return res.status(404).render('404', { url: req.originalUrl });
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
            return res.status(404).render('404', { url: req.originalUrl });
        }

        await teacher.update({
            name: req.body.name.trim(),
            email: req.body.email.trim(),
            department: req.body.department.trim(),
            academicDegree: req.body.academicDegree.trim()
        });

        res.redirect('/teachers/' + teacher.id);
    } catch (error) {
        next(error);
    }
}

async function deleteTeacher(req, res, next) {
    try {
        const teacher = await Teacher.findByPk(req.params.id, { include: Course });

        if (!teacher) {
            return res.status(404).render('404', { url: req.originalUrl });
        }

        if (teacher.Courses.length > 0) {
            return res.status(400).render('teachers/details', {
                teacher: teacher,
                error: 'Невозможно удалить преподавателя, у которого есть курсы'
            });
        }

        await teacher.destroy();
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
