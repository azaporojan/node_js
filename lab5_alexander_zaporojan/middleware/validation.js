const { body } = require('express-validator');

function checkId(req, res, next) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        const error = new Error('Запись не найдена');
        error.status = 404;
        return next(error);
    }

    next();
}

const registerRules = [
    body('name').trim().isLength({ min: 2 }).withMessage('Имя должно содержать минимум два символа'),
    body('email').trim().isEmail().withMessage('Введите корректный email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум шесть символов'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Пароль и подтверждение не совпадают');
        }
        return true;
    })
];

const loginRules = [
    body('email').trim().isEmail().withMessage('Введите корректный email'),
    body('password').notEmpty().withMessage('Введите пароль')
];

const teacherRules = [
    body('name').trim().notEmpty().withMessage('Имя преподавателя обязательно'),
    body('email').trim().isEmail().withMessage('Введите корректный email'),
    body('department').trim().notEmpty().withMessage('Кафедра обязательна'),
    body('academicDegree').trim().notEmpty().withMessage('Учёная степень обязательна')
];

const courseRules = [
    body('title').trim().notEmpty().withMessage('Название дисциплины обязательно'),
    body('credits').isInt({ min: 1 }).withMessage('Количество кредитов должно быть положительным числом'),
    body('semester').isInt({ min: 1, max: 8 }).withMessage('Семестр должен находиться в диапазоне от 1 до 8'),
    body('description').trim().notEmpty().withMessage('Описание обязательно'),
    body('teacherId').isInt({ min: 1 }).withMessage('Выберите преподавателя')
];

module.exports = { checkId, registerRules, loginRules, teacherRules, courseRules };
