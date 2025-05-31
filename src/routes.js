const express = require('express');
const {
    index,
    showEventDetails,
    participantDashboard,
    organizerDashboard,
    showCreateForm,
    createEvent,
    registerToEvent
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

router.get('/dashboard/participant/:id', authenticate, authorize('participant'), participantDashboard);
router.get('/dashboard/organizer/:id', authenticate, authorize('organizer'), organizerDashboard);

router.get('/create-event/:organizerId', authenticate, authorize('organizer'), showCreateForm);
router.post('/create-event/:organizerId', authenticate, authorize('organizer'), createEvent);

router.post('/register', authenticate, authorize('participant'), registerToEvent);

module.exports = router;
