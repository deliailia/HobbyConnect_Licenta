const fs = require('fs');
const mongoose = require('mongoose');
const OutdoorAnswer = require('../models/answerOutdoor');  


mongoose.connect('mongodb://localhost:27017/HobbyConnectDB', {})
  .then(() => console.log('Conectat la MongoDB'))
  .catch(err => console.error('Eroare la conectarea la MongoDB:', err));


fs.readFile('./backend/scriptsJSON/outdoorAnswers.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Eroare la citirea fișierului:', err);
    return;
  }

  const outdoorData = JSON.parse(data);  

  const seedOutdoorData = outdoorData.outdoorGroups.flatMap(group => 
    group.answers.map(answer => ({
      option: answer.option,  
      group: answer.group,     
      category: group.category,  
    }))
  );

 
  OutdoorAnswer.insertMany(seedOutdoorData)
    .then(() => {
      console.log('Datele outdoor au fost populate cu succes!');
      mongoose.disconnect();
    })
    .catch(err => console.error('Eroare la popularea datelor outdoor:', err));
});