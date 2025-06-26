const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Crearea unui eveniment
router.post('/events', eventController.createEvent);

// Obținerea tuturor evenimentelor
router.get('/events', eventController.getAllEvents);

// Obținerea unui eveniment pe baza unui ID
router.get('/events/:id', eventController.getEventById);

// Adăugarea unui participant la un eveniment
router.put('/events/participants', eventController.addParticipant);

module.exports = router;
