require('dotenv').config();

const express = require('express');
const { sequelize } = require('./models');
const logger = require('./middleware/logger');
const courseRoutes = require('./routes/courseRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const courseController = require('./controllers/courseController');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(logger);

app.get('/', (req, res) => {
    res.redirect('/courses');
});

app.use('/courses', courseRoutes);
app.use('/teachers', teacherRoutes);
app.get('/statistics', courseController.getStatistics);

app.use((req, res) => {
    res.status(404).render('404', { url: req.originalUrl });
});

app.use((err, req, res, next) => {
    console.log('Error:', err.message);
    res.status(500).render('error');
});

async function start() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established');

        await sequelize.sync();

        app.listen(PORT, () => {
            console.log('Server is running at http://localhost:' + PORT);
        });
    } catch (error) {
        console.log('Не удалось подключиться к базе данных. Проверьте настройки в файле .env');
        console.log('Причина: ' + error.message);
    }
}

start();
