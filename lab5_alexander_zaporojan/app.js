require('dotenv').config();

const http = require('http');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const { Server } = require('socket.io');
const { sequelize } = require('./models');
const { fileLogger } = require('./middleware/logger');
const { isAuthenticated } = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const courseController = require('./controllers/courseController');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.set('io', io);

app.use(morgan('dev'));
app.use(fileLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

app.get('/', (req, res) => {
    res.redirect('/courses');
});

app.use('/', authRoutes);
app.use('/courses', courseRoutes);
app.use('/teachers', teacherRoutes);
app.get('/statistics', isAuthenticated, courseController.getStatistics);

app.use(notFound);
app.use(errorHandler);

async function start() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established');

        await sequelize.sync();

        server.listen(PORT, () => {
            console.log('Server is running at http://localhost:' + PORT);
        });
    } catch (error) {
        console.log('Не удалось подключиться к базе данных. Проверьте настройки в файле .env');
        console.log('Причина: ' + error.message);
    }
}

start();
