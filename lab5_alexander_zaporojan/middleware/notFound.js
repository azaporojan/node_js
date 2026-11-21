function notFound(req, res, next) {
    const error = new Error('Страница не найдена');
    error.status = 404;
    next(error);
}

module.exports = notFound;
