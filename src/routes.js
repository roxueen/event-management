const express = require('express');
const {
    index,
    showEventDetails,
    showCreateForm,
    createEvent,
    registerToEvent,
    dashboard
} = require("./controllers/eventController");
const {
    showLoginForm,
    loginUser,
    showSignupForm,
    signupUser
} = require("./controllers/authController");
const {
    authenticate,
    authorize
} = require("./middleware");

const router = express.Router();


router.get('/login', showLoginForm);
router.post('/login', loginUser);

router.get('/signup', showSignupForm);
router.post('/signup', signupUser);

router.post('/logout', loginUser);

router.get('/', index);
router.get('/event/:id', showEventDetails);

router.get('/dashboard', authenticate, dashboard);

router.get('/create-event', authenticate, showCreateForm);
router.post('/create-event', authenticate, createEvent);

router.post('/register-to-event', authenticate, authorize('participant'), registerToEvent);

module.exports = router;
