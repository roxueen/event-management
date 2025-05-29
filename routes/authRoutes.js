const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.showLoginForm);
router.post('/login', authController.loginUser);

router.get('/signup', authController.showSignupForm);
router.post('/signup', authController.signupUser);


module.exports = router;