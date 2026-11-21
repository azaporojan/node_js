const express = require('express');
const teacherController = require('../controllers/teacherController');
const { isAdmin } = require('../middleware/auth');
const { checkId, teacherRules } = require('../middleware/validation');

const router = express.Router();

router.get('/', teacherController.getTeachers);
router.get('/new', isAdmin, teacherController.showCreateForm);
router.post('/', isAdmin, teacherRules, teacherController.createTeacher);
router.get('/:id', checkId, teacherController.getTeacherById);
router.get('/:id/edit', isAdmin, checkId, teacherController.showEditForm);
router.post('/:id/edit', isAdmin, checkId, teacherRules, teacherController.updateTeacher);
router.post('/:id/delete', isAdmin, checkId, teacherController.deleteTeacher);

module.exports = router;
