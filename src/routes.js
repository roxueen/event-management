const express = require('express');
const authController = require('./controllers/authController');
const {
    index,
    showEventDetails,
    participantDashboard,
    organizerDashboard,
    showCreateForm,
    createEvent,
    registerToEvent
} = require("./controllers/eventController");

const router = express.Router();


router.get('/login', authController.showLoginForm);
router.post('/login', authController.loginUser);

router.get('/signup', authController.showSignupForm);
router.post('/signup', authController.signupUser);

router.get('/', index);
router.get('/event/:id', showEventDetails);

router.get('/dashboard/participant/:id', participantDashboard);
router.get('/dashboard/organizer/:id', organizerDashboard);

router.get('/create-event/:organizerId', showCreateForm);
router.post('/create-event/:organizerId', createEvent);

router.post('/register', registerToEvent);

module.exports = router;
