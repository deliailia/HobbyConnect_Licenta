const fs = require('fs');
const mongoose = require('mongoose');
const IndoorAnswer = require('../models/answerIndoor');  

mongoose.connect('mongodb://localhost:27017/HobbyConnectDB', {})
  .then(() => console.log('Conectat la MongoDB'))
  .catch(err => console.error('Eroare la conectarea la MongoDB:', err));

fs.readFile('./backend/scriptsJSON/indoorAnswers.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Eroare la citirea fisierului:', err);
    return;
  }

  const indoorData = JSON.parse(data);  

  const seedIndoorData = indoorData.indoorGroups.flatMap(group => 
    group.answers.map(answer => ({
      option: answer.option,   
      group: answer.group,     
      category: group.category,  
    }))
  );

  IndoorAnswer.insertMany(seedIndoorData)
    .then(() => {
      console.log('Datele indoor au fost populate cu succes!');
      mongoose.disconnect();
    })
    .catch(err => console.error('Eroare la popularea datelor indoor:', err));
});