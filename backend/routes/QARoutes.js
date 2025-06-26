const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController'); 

const { getRandomQuestionByCategory } = require('../controllers/questionController');


router.post('/addQuestion', questionController.addQuestion);


router.get('/:id', questionController.getQuestionById);

router.get('/category/:category', getRandomQuestionByCategory);

module.exports = router;
