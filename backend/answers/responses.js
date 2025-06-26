const fs = require('fs');
const mongoose = require('mongoose');
const AnswerSoccer = require('../models/answerSoccer');  


mongoose.connect('mongodb://localhost:27017/HobbyConnectDB', {})
  .then(() => console.log('Conectat la MongoDB'))
  .catch(err => console.error('Eroare la conectarea la MongoDB:', err));

fs.readFile('./backend/scriptsJSON/sportsAnswers.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Eroare la citirea fisierului:', err);
    return;
  }

  const sportData = JSON.parse(data);  

  const seedData = sportData.sportGroups.flatMap(group => 
    group.answers.map(answer => ({
      option: answer.option,   
      group: answer.group,     
      category: group.category,  
    }))
  );

  AnswerSoccer.insertMany(seedData)
    .then(() => {
      console.log('Datele au fost populate cu succes!');
      mongoose.disconnect();
    })
    .catch(err => console.error('Eroare la popularea datelor:', err));
});
