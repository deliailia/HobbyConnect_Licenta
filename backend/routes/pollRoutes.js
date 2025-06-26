const express = require('express');
const router = express.Router();

const pollController = require('../controllers/pollController');

// Creează un poll nou cu întrebare + opțiuni personalizate
router.post('/polls', pollController.createPoll);

// Votează pentru un poll (cu ID-ul în URL)
router.post('/polls/:id/vote', pollController.votePoll);

// Obține toate poll-urile dintr-un subgroup (grup + subcategorie)
router.get('/polls/:groupName/:subcategoryName', pollController.getPollsForSubgroup);

module.exports = router;
