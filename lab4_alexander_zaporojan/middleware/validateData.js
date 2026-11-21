const { Teacher } = require('../models');

function checkId(req, res, next) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(404).render('404', { url: req.originalUrl });
    }

    next();
}

async function validateTeacher(req, res, next) {
    try {
        const errors = [];
        const email = req.body.email ? req.body.email.trim() : '';

        if (!req.body.name || req.body.name.trim() === '') {
            errors.push('Имя преподавателя обязательно');
        }

        if (email === '') {
            errors.push('Email обязателен');
        } else if (!email.includes('@') || !email.includes('.') || email.includes(' ')) {
            errors.push('Email имеет некорректный формат');
        } else {
            const existing = await Teacher.findOne({ where: { email: email } });

            if (existing && existing.id !== Number(req.params.id)) {
                errors.push('Преподаватель с таким email уже существует');
            }
        }

        if (!req.body.department || req.body.department.trim() === '') {
            errors.push('Кафедра обязательна');
        }

        if (!req.body.academicDegree || req.body.academicDegree.trim() === '') {
            errors.push('Учёная степень обязательна');
        }

        if (errors.length > 0) {
            const teacher = req.body;

            if (req.params.id) {
                teacher.id = req.params.id;
                return res.status(400).render('teachers/edit', { teacher: teacher, errors: errors });
            }

            return res.status(400).render('teachers/create', { teacher: teacher, errors: errors });
        }

        next();
    } catch (error) {
        next(error);
    }
}

async function validateCourse(req, res, next) {
    try {
        const errors = [];
        const credits = Number(req.body.credits);
        const semester = Number(req.body.semester);
        const teacherId = Number(req.body.teacherId);

        if (!req.body.title || req.body.title.trim() === '') {
            errors.push('Название дисциплины обязательно');
        }

        if (!Number.isInteger(credits) || credits <= 0) {
            errors.push('Количество кредитов должно быть положительным числом');
        }

        if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
            errors.push('Семестр должен находиться в диапазоне от 1 до 8');
        }

        if (!req.body.description || req.body.description.trim() === '') {
            errors.push('Описание обязательно');
        }

        if (!Number.isInteger(teacherId) || teacherId < 1) {
            errors.push('Выберите преподавателя');
        } else {
            const teacher = await Teacher.findByPk(teacherId);

            if (!teacher) {
                errors.push('Выбранный преподаватель не существует');
            }
        }

        if (errors.length > 0) {
            const course = req.body;
            const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });

            if (req.params.id) {
                course.id = req.params.id;
                return res.status(400).render('courses/edit', { course: course, teachers: teachers, errors: errors });
            }

            return res.status(400).render('courses/create', { course: course, teachers: teachers, errors: errors });
        }

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = { checkId, validateTeacher, validateCourse };
