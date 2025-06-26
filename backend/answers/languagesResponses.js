const fs = require('fs');
const mongoose = require('mongoose');
const LanguagesAnswer = require('../models/answerLanguages');  

mongoose.connect('mongodb://localhost:27017/HobbyConnectDB', {})
  .then(() => console.log('Conectat la MongoDB'))
  .catch(err => console.error('Eroare la conectarea la MongoDB:', err));

fs.readFile('../scriptsJSON/languagesAnswers.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Eroare la citirea fisierului:', err);
    return;
  }

  const languagesData = JSON.parse(data);  

  const seedLanguagesData = languagesData.languagesGroups.flatMap(group => 
    group.answers.map(answer => ({
      option: answer.option,   
      group: answer.group,     
      category: group.category,  
    }))
  );

  LanguagesAnswer.insertMany(seedLanguagesData)
    .then(() => {
      console.log('Datele languages au fost populate cu succes!');
      mongoose.disconnect();
    })
    .catch(err => console.error('Eroare la popularea datelor languages:', err));
});