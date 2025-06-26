const Event = require('../models/Event');

// Crearea unui eveniment nou
exports.createEvent = async (req, res) => {
  const { title, creator, date, location, subcategory, participants } = req.body;

  try {
    // Validarea câmpurilor necesare
    if (!title || !creator || !date || !location || !subcategory) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Crearea unui nou eveniment
    const newEvent = new Event({
      title,
      creator,  // username-ul creatorului
      date,
      location,
      subcategory,
      participants,  // Lista de participanți (poate fi un array de username-uri)
    });

    // Salvarea evenimentului în baza de date
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Obținerea tuturor evenimentelor
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Obținerea unui eveniment pe baza unui ID
exports.getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Adăugarea unui participant
exports.addParticipant = async (req, res) => {
  const { eventId, participant } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Verificăm dacă participantul există deja în lista
    if (event.participants.includes(participant)) {
      return res.status(400).json({ message: 'Participant already added' });
    }

    // Adăugăm participantul la eveniment
    event.participants.push(participant);
    await event.save();

    res.status(200).json({ message: 'Participant added successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Actualizarea unui eveniment existent
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, creator, date, location, subcategory, participants } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Actualizăm doar câmpurile care sunt trimise în cerere
    if (title) event.title = title;
    if (creator) event.creator = creator;
    if (date) event.date = date;
    if (location) event.location = location;
    if (subcategory) event.subcategory = subcategory;
    if (participants) event.participants = participants;

    await event.save();
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Ștergerea unui eveniment
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
