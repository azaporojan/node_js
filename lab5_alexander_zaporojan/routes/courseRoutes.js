const express = require('express');
const courseController = require('../controllers/courseController');
const { isAdmin } = require('../middleware/auth');
const { checkId, courseRules } = require('../middleware/validation');

const router = express.Router();

router.get('/', courseController.getCourses);
router.get('/new', isAdmin, courseController.showCreateForm);
router.post('/', isAdmin, courseRules, courseController.createCourse);
router.get('/:id', checkId, courseController.getCourseById);
router.get('/:id/edit', isAdmin, checkId, courseController.showEditForm);
router.post('/:id/edit', isAdmin, checkId, courseRules, courseController.updateCourse);
router.post('/:id/delete', isAdmin, checkId, courseController.deleteCourse);

module.exports = router;
