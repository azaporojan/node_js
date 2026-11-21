const express = require('express');
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const { registerRules, loginRules } = require('../middleware/validation');

const router = express.Router();

router.get('/register', authController.showRegisterForm);
router.post('/register', registerRules, authController.register);
router.get('/login', authController.showLoginForm);
router.post('/login', loginRules, authController.login);
router.post('/logout', authController.logout);
router.get('/profile', isAuthenticated, authController.getProfile);

module.exports = router;
