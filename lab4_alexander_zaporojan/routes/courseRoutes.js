const express = require('express');
const courseController = require('../controllers/courseController');
const { checkId, validateCourse } = require('../middleware/validateData');

const router = express.Router();

router.get('/', courseController.getCourses);
router.get('/new', courseController.showCreateForm);
router.post('/', validateCourse, courseController.createCourse);
router.get('/:id', checkId, courseController.getCourseById);
router.get('/:id/edit', checkId, courseController.showEditForm);
router.post('/:id/edit', checkId, validateCourse, courseController.updateCourse);
router.post('/:id/delete', checkId, courseController.deleteCourse);

module.exports = router;
