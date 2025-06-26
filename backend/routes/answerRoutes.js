const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');  

router.post('/saveAnswer', async (req, res) => {
  const { question, selectedAnswer } = req.body;

  if (!question || !selectedAnswer) {
    return res.status(400).json({ error: 'Question and answer are required.' });
  }

  try {
    const newAnswer = new Answer({
      question,
      selectedAnswer,
    });

    await newAnswer.save();
    res.status(200).json({ message: 'Answer saved successfully.' });
  } catch (err) {
    console.error('Error saving answer:', err);
    res.status(500).json({ error: 'Failed to save answer.' });
  }
});

module.exports = router;
