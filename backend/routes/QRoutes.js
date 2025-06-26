const express = require('express');
const router = express.Router();
const Questions = require('../models/Questions'); 

router.post('/add', async ( req, res) => {
    try {
        const { questionText, options, givenresp } = req.body;
    
        const newQuestion = new Questions({
          questionText,
          options,
          givenresp
        });

        await newQuestion.save();
        res.status(201).json(newQuestion); 
      } catch (err) {
        res.status(500).json({ message: 'Eroare la adaugarea intrebarii' });
      }
     
    
});

router.get('/:id', async (req, res) => {
    try {
      const question = await Questions.findById(req.params.id);  
      if (!question) {
        return res.status(404).json({ message: 'intrebarea nu a fost gasita' });
      }
      res.status(200).json(question);  
    } catch (err) {
      res.status(500).json({ message: 'Eroare la obtinerea intrebarii' });
    }
  });


  module.exports = router;