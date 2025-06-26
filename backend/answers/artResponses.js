const fs = require('fs');
const mongoose = require('mongoose');
const ArtAnswer = require('../models/answerArt'); 

mongoose.connect('mongodb://localhost:27017/HobbyConnectDB', {})
  .then(() => console.log('Conectat la MongoDB'))
  .catch(err => console.error('Eroare la conectarea la MongoDB:', err));

fs.readFile('./backend/scriptsJSON/artAnswers.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Erorr reading file:', err);
    return;
  }

  const artData = JSON.parse(data); 

  const seedArtData = artData.artGroups.flatMap(group => 
    group.answers.map(answer => ({
      option: answer.option,   
      group: answer.group,     
      category: group.category, 
    }))
  );

  ArtAnswer.insertMany(seedArtData)
    .then(() => {
      console.log('Datele art au fost populate cu succes!');
      mongoose.disconnect();
    })
    .catch(err => console.error('Eroare la popularea datelor art:', err));
});