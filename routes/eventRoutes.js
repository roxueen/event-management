const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Pagina principală (listă evenimente)
router.get('/', eventController.index);

// Dashboard-uri
router.get('/dashboard/participant/:id', eventController.participantDashboard);
router.get('/dashboard/organizer/:id', eventController.organizerDashboard);

// Detalii eveniment
router.get('/event/:id', eventController.showEventDetails);

// Creare eveniment (doar pentru organizatori)
router.get('/create-event/:organizerId', eventController.showCreateForm);
router.post('/create-event/:organizerId', eventController.createEvent);

// Înregistrare participant la eveniment
router.post('/register', eventController.registerToEvent);

module.exports = router;
