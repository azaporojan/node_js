function errorHandler(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message;

    if (err.name === 'SequelizeUniqueConstraintError') {
        status = 409;
        message = 'Запись с таким email уже существует';
    } else if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeForeignKeyConstraintError') {
        status = 400;
        message = 'Некорректные данные';
    }

    if (status === 404) {
        return res.status(404).render('404', { url: req.originalUrl, message: message });
    }

    if (status === 403) {
        return res.status(403).render('403');
    }

    if (status === 500) {
        console.log('Error:', err.message);
        message = 'Внутренняя ошибка сервера. Попробуйте позже.';
    }

    res.status(status).render('error', { status: status, message: message });
}

module.exports = errorHandler;
