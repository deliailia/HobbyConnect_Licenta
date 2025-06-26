const Poll = require('../models/Poll');

// Creează un poll nou cu opțiuni personalizate
const createPoll = async (req, res) => {
  try {
    const { question, groupName, subcategoryName, createdBy, options } = req.body;
console.log('Creare poll:', { question, groupName, subcategoryName, createdBy, options });
    if (!question || !groupName || !subcategoryName || !createdBy || !options) {
      return res.status(400).json({ error: 'Toate câmpurile sunt necesare, inclusiv opțiunile' });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Trebuie să existe cel puțin două opțiuni' });
    }

    const newPoll = new Poll({
      question,
      groupName,
      subcategoryName,
      createdBy,
      options,
      members: []
    });

    await newPoll.save();
    res.status(201).json(newPoll);
  } catch (err) {
    console.error('Eroare la crearea poll-ului:', err);
    res.status(500).json({ error: 'Eroare internă la server' });
  }
};

// Votează pentru un poll
const votePoll = async (req, res) => {
  try {
    const { username, choice } = req.body;
    const pollId = req.params.id;

    if (!username || !choice) {
      return res.status(400).json({ error: 'Username și opțiunea aleasă sunt necesare' });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll-ul nu a fost găsit' });

    if (!poll.options.includes(choice)) {
      return res.status(400).json({ error: `Alegerea '${choice}' nu este validă pentru acest poll` });
    }

    const existingVote = poll.members.find(m => m.username === username);
    if (existingVote) {
      existingVote.choice = choice; // actualizează votul existent
    } else {
      poll.members.push({ username, choice }); // adaugă vot nou
    }

    await poll.save();
    res.json({ message: 'Vot înregistrat', poll });
  } catch (err) {
    console.error('Eroare la vot:', err);
    res.status(500).json({ error: 'Eroare internă la server' });
  }
};
const getPollsForSubgroup = async (req, res) => {
  try {
    const { groupName, subcategoryName } = req.params;

    const polls = await Poll.find({
      groupName,
      subcategoryName
    }).sort({ createdAt: -1 });

    // Map ca să adaugi timestamp pentru fiecare poll
    const pollsWithTimestamp = polls.map(poll => ({
      ...poll.toObject(),
      timestamp: poll.createdAt,
    }));

    res.json(pollsWithTimestamp);
  } catch (err) {
    console.error('Eroare la preluarea poll-urilor:', err);
    res.status(500).json({ error: 'Eroare internă la server' });
  }
};


module.exports = {
  createPoll,
  votePoll,
  getPollsForSubgroup
};
