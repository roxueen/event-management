const express = require('express');
const {
    index,
    showEventDetails,
    showCreateForm,
    createEvent,
    registerToEvent,
    dashboard, deleteEvent
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
const multer = require('multer');
const {extname} = require("node:path");


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.get('/login', showLoginForm);
router.post('/login', loginUser);

router.get('/signup', showSignupForm);
router.post('/signup', signupUser);

router.post('/logout', loginUser);

router.get('/', index);
router.get('/event/:id', showEventDetails);

router.get('/dashboard', authenticate, dashboard);

router.get('/create-event', authenticate, showCreateForm);
router.post('/create-event', authenticate, upload.single('photo'), createEvent);
router.post('/delete-event', authenticate, authorize('organizer'), deleteEvent);

router.post('/register-to-event', authenticate, authorize('participant'), registerToEvent);

module.exports = router;
