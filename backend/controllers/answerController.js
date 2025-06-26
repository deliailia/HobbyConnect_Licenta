const express = require('express');
const router = express.Router();
const Answer = require('../models/Answers'); 

router.post('/saveAnswer', (req, res) => {
  const { question, selectedAnswer } = req.body;

  if (!question || !selectedAnswer) {
    return res.status(400).send("Question and answer are required.");
  }

  const newAnswer = new Answer({
    question,
    selectedAnswer,
  });

  newAnswer.save()
    .then(() => {
      res.status(200).send("Answer saved successfully.");
    })
    .catch((err) => {
      console.error("Error saving answer:", err);
      res.status(500).send("Failed to save answer.");
    });
});

module.exports = router;
