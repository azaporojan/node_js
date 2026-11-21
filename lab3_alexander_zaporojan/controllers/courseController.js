const courses = require('../models/courseModel');

function getCourses(req, res) {
    const search = req.query.search || '';
    const semester = req.query.semester || '';
    let result = courses;

    if (search) {
        const text = search.toLowerCase();
        result = result.filter((c) => {
            return c.title.toLowerCase().includes(text) || c.teacher.toLowerCase().includes(text);
        });
    }

    if (semester) {
        result = result.filter((c) => c.semester === Number(semester));
    }

    res.render('courses/index', { courses: result, search: search, semester: semester });
}

function showCreateForm(req, res) {
    res.render('courses/create', { course: {}, errors: [] });
}

function createCourse(req, res) {
    let maxId = 0;
    for (const course of courses) {
        if (course.id > maxId) {
            maxId = course.id;
        }
    }

    const newCourse = {
        id: maxId + 1,
        title: req.body.title.trim(),
        teacher: req.body.teacher.trim(),
        credits: Number(req.body.credits),
        semester: Number(req.body.semester),
        description: req.body.description.trim()
    };

    courses.push(newCourse);
    res.redirect('/courses');
}

function getCourseById(req, res) {
    const id = Number(req.params.id);
    const course = courses.find((c) => c.id === id);

    if (!course) {
        return res.status(404).render('404', { url: req.originalUrl });
    }

    res.render('courses/details', { course: course });
}

function showEditForm(req, res) {
    const id = Number(req.params.id);
    const course = courses.find((c) => c.id === id);

    if (!course) {
        return res.status(404).render('404', { url: req.originalUrl });
    }

    res.render('courses/edit', { course: course, errors: [] });
}

function updateCourse(req, res) {
    const id = Number(req.params.id);
    const course = courses.find((c) => c.id === id);

    if (!course) {
        return res.status(404).render('404', { url: req.originalUrl });
    }

    course.title = req.body.title.trim();
    course.teacher = req.body.teacher.trim();
    course.credits = Number(req.body.credits);
    course.semester = Number(req.body.semester);
    course.description = req.body.description.trim();

    res.redirect('/courses/' + course.id);
}

function deleteCourse(req, res) {
    const id = Number(req.params.id);
    const index = courses.findIndex((c) => c.id === id);

    if (index === -1) {
        return res.status(404).render('404', { url: req.originalUrl });
    }

    courses.splice(index, 1);
    res.redirect('/courses');
}

module.exports = {
    getCourses,
    showCreateForm,
    createCourse,
    getCourseById,
    showEditForm,
    updateCourse,
    deleteCourse
};
