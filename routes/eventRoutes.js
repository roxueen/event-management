const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');

// Ruta pentru pagina principală (lista evenimente)
router.get('/', eventController.index);

// Login și Signup
router.get('/login', authController.showLoginForm);
router.post('/login', authController.loginUser);
router.get('/signup', authController.showSignupForm);
router.post('/signup', authController.signupUser);

// Dashboard-uri în funcție de tipul de cont
router.get('/dashboard/participant/:id', eventController.participantDashboard);
//router.get('/dashboard/:id', eventController.organizerDashboard); // Creezi această funcție în controller

// Formular creare eveniment (organizer)
router.get('/create-event/:organizerId', eventController.showCreateForm);
router.post('/create-event/:organizerId', eventController.createEvent);


module.exports = router;