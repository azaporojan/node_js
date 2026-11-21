function validateCourse(req, res, next) {
    const errors = [];
    const credits = Number(req.body.credits);
    const semester = Number(req.body.semester);

    if (!req.body.title || req.body.title.trim() === '') {
        errors.push('Название дисциплины обязательно');
    }

    if (!req.body.teacher || req.body.teacher.trim() === '') {
        errors.push('Имя преподавателя обязательно');
    }

    if (isNaN(credits) || credits <= 0) {
        errors.push('Количество кредитов должно быть положительным числом');
    }

    if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
        errors.push('Семестр должен находиться в диапазоне от 1 до 8');
    }

    if (!req.body.description || req.body.description.trim() === '') {
        errors.push('Описание обязательно');
    }

    if (errors.length > 0) {
        const course = req.body;

        if (req.params.id) {
            course.id = req.params.id;
            return res.status(400).render('courses/edit', { course: course, errors: errors });
        }

        return res.status(400).render('courses/create', { course: course, errors: errors });
    }

    next();
}

module.exports = validateCourse;
