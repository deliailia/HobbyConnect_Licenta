const express = require('express');
const router = express.Router();
const SavedEvent = require('../models/savedEvents');
const Event = require('../models/Event');

// Salvează un eveniment pentru un utilizator
router.post('/:eventId/:username', async (req, res) => {
    const { eventId, username } = req.params;
    console.log(`Received eventId: ${eventId}, username: ${username}`);

  
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      let savedEvent = await SavedEvent.findOne({
        title: event.title,
        creator: event.creator,
      });
  
      if (!savedEvent) {
        savedEvent = new SavedEvent({
          title: event.title,
          creator: event.creator,
          savedBy: [username],
        });
      } else {
        if (!savedEvent.savedBy.includes(username)) {
          savedEvent.savedBy.push(username);
        }
      }
  
      await savedEvent.save();
      res.status(200).json({ message: 'Event saved', savedEvent });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Afișează dacă un utilizator a salvat un eveniment
router.get('/:eventId/:username', async (req, res) => {
    const { eventId, username } = req.params;
  
    try {
      const savedEvent = await SavedEvent.findOne({ _id: eventId });
      if (!savedEvent) {
        return res.status(404).json({ message: 'Saved event not found' });
      }
  
      // Verificăm dacă evenimentul a fost salvat de utilizatorul specificat
      if (savedEvent.savedBy.includes(username)) {
        res.status(200).json({ message: 'Event is saved by this user' });
      } else {
        res.status(404).json({ message: 'User has not saved this event' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/', async (req, res) => {
    try {
      // Obține toate evenimentele salvate, fără să faci populate
      const savedEvents = await SavedEvent.find();
  
      // Pentru fiecare eveniment salvat, obține detalii din colecția Event
      const eventsWithDetails = await Promise.all(savedEvents.map(async (savedEvent) => {
        const eventDetails = await Event.findById(savedEvent.eventId); // Poți face interogare pentru a obține detaliile evenimentului
        return {
          ...savedEvent.toObject(), // Transformă documentul SavedEvent într-un obiect normal
          eventDetails // Adaugă detalii despre eveniment
        };
      }));
  
      res.status(200).json(eventsWithDetails);
    } catch (err) {
      console.error('Error fetching saved events:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  });
  

  

module.exports = router;
