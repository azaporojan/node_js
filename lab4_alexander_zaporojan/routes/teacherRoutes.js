const express = require('express');
const teacherController = require('../controllers/teacherController');
const { checkId, validateTeacher } = require('../middleware/validateData');

const router = express.Router();

router.get('/', teacherController.getTeachers);
router.get('/new', teacherController.showCreateForm);
router.post('/', validateTeacher, teacherController.createTeacher);
router.get('/:id', checkId, teacherController.getTeacherById);
router.get('/:id/edit', checkId, teacherController.showEditForm);
router.post('/:id/edit', checkId, validateTeacher, teacherController.updateTeacher);
router.post('/:id/delete', checkId, teacherController.deleteTeacher);

module.exports = router;
