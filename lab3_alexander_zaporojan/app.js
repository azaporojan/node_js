const express = require('express');
const logger = require('./middleware/logger');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(logger);

app.get('/', (req, res) => {
    res.redirect('/courses');
});

app.use('/courses', courseRoutes);

app.use((req, res) => {
    res.status(404).render('404', { url: req.originalUrl });
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).render('error');
});

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
