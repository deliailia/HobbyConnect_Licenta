const TestResult = require('../models/testResult');
const User = require('../models/User');
const AnswerSoccer = require('../models/answerSoccer');  
const AnswerIndoor = require('../models/answerIndoor');  
const AnswerOutdoor = require('../models/answerOutdoor');
const AnswerArt = require('../models/answerArt'); 
const AnswerLanguages = require('../models/answerLanguages'); 

const saveTestResult = async (req, res) => {
  try {
    const { testName, questions, userId } = req.body; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const answersInDBSport = await AnswerSoccer.find(); 
    const answersInDBIndoor = await AnswerIndoor.find(); 
    const answersInDBOutdoor = await AnswerOutdoor.find(); 
    const answersInDBArt = await AnswerArt.find(); 
    const answersInDBLanguages = await AnswerLanguages.find(); 

    const answerMappingSport = answersInDBSport.reduce((acc, answer) => {
      acc[answer.option] = answer.group; 
      return acc;
    }, {});

    const answerMappingIndoor = answersInDBIndoor.reduce((acc, answer) => {
      acc[answer.option] = answer.group; 
      return acc;
    }, {});

    const answerMappingOutdoor = answersInDBOutdoor.reduce((acc, answer) => {
      acc[answer.option] = answer.group; 
      return acc;
    }, {});

    const answerMappingArt = answersInDBArt.reduce((acc, answer) => {
      acc[answer.option] = answer.group; 
      return acc;
    }, {});
    const answerMappingLanguages = answersInDBLanguages.reduce((acc, answer) => {
      acc[answer.option] = answer.group; 
      return acc;
    }, {});


    const sportScores = {
      Soccer: 0,
      Volleyball: 0,
      Basketball: 0,
      Pilates: 0,
    };

    const indoorScores = {
      Music: 0,
      Gaming: 0,
      Movie: 0,
    };

    const outdoorScores = {
      Travelling: 0,
      Walking: 0,
      Coffee: 0,
      Food: 0,
    };
    const artScores = {
      Photography: 0,
      Drawing: 0,
      Compositor: 0,
      Choreography: 0,
    };

    const languagesScores = {
      French: 0,
      Italian: 0,
      Korean: 0,
      Spanish: 0,
      Norvegian:0
    };

    questions.forEach(({ answer }) => {
      const sportGroup = answerMappingSport[answer.trim()]; 
      const indoorGroup = answerMappingIndoor[answer.trim()]; 
      const outdoorGroup = answerMappingOutdoor[answer.trim()]; 
      const artGroup = answerMappingArt[answer.trim()];
      const languagesGroup = answerMappingLanguages[answer.trim()];

      
      //console.log(`Answer: ${answer}, Mapped Sport Group: ${sportGroup}, Mapped Indoor Group: ${indoorGroup}, Mapped Outdoor Group: ${outdoorGroup},  Mapped Art Group: ${artGroup},  Mapped Languages Group: ${languagesGroup}`);
      console.log(`Answer: ${answer}, Mapped Languages Group: ${languagesGroup}`);

      if (sportGroup) {
        if (['Soccer', 'Volleyball', 'Basketball', 'Pilates'].includes(sportGroup)) {
          sportScores[sportGroup] += 1;
        }
      }

      if (indoorGroup) {
        if (['Music', 'Gaming', 'Movie'].includes(indoorGroup)) {
          indoorScores[indoorGroup] += 1; 
        }
      }

      if (outdoorGroup) {
        if (['Travelling', 'Walking', 'Coffee', 'Food'].includes(outdoorGroup)) {
          outdoorScores[outdoorGroup] += 1; 
        }
      }
    

    if (artGroup) {
      if (['Photography', 'Drawing', 'Compositor', 'Choreography'].includes(artGroup)) {
        artScores[artGroup] += 1; 
      }
    }
    if (languagesGroup) {
      if (['French', 'Italian', 'Spanish', 'Korean', 'Norvegian'].includes(languagesGroup)) {
        languagesScores[languagesGroup] += 1; 
      }
    }
  });

    const finalSport = Object.keys(sportScores).reduce((a, b) =>
  sportScores[a] > sportScores[b] ? a : b
).toLowerCase();

const finalIndoorActivity = Object.keys(indoorScores).reduce((a, b) =>
  indoorScores[a] > indoorScores[b] ? a : b
).toLowerCase();

const finalOutdoorActivity = Object.keys(outdoorScores).reduce((a, b) =>
  outdoorScores[a] > outdoorScores[b] ? a : b
).toLowerCase();

const finalArt = Object.keys(artScores).reduce((a, b) =>
  artScores[a] > artScores[b] ? a : b
).toLowerCase();

const finalLanguages = Object.keys(languagesScores).reduce((a, b) =>
  languagesScores[a] > languagesScores[b] ? a : b
).toLowerCase();


    console.log('Questions:', questions);
    console.log('Sport scores:', sportScores);
    console.log('Indoor activity scores:', indoorScores);
    console.log('Outdoor activity scores:', outdoorScores);
    console.log('Art activity scores:', artScores);
    console.log('Languages activity scores:', languagesScores);

    const newTestResult = new TestResult({
      testName,
      questions, 
      userId,
      sportScores,  
      indoorScores,
      outdoorScores, 
      artScores,
      languagesScores,
      finalSport,
      finalIndoorActivity,
      finalOutdoorActivity, 
      finalArt, 
      finalLanguages, 
      username: user.username,
      email: user.email,
      status: 1 ,
      date: new Date()
    });

    console.log('Document to save:', newTestResult);
    
    await newTestResult.save();

    res.status(200).json({
      message: 'Test result saved successfully',
      finalSport,
      finalIndoorActivity,
      finalOutdoorActivity,
      finalArt,
      finalLanguages,
      sportScores,
      indoorScores,
      outdoorScores,
      artScores,
      languagesScores,
      status: 1
    });
  } catch (error) {
    console.error('Error saving test result:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTestResult = async (req, res) => {
  const { username } = req.params;
    const testResult = await TestResult.findOne({ username }).sort({ date: -1 });
 if (!testResult) {
      console.error('No test result found for user:', username);
      return res.status(404).json({ message: 'Test result not found' });
    }

    console.log('Test result found:', testResult.testName);

  let response;  // Variabila pentru a stoca răspunsul

  try {
    // Căutăm rezultatul testului pentru utilizatorul specificat
console.log(testResult.testName);
    
    let finalActivity = 'No activity available'; // Default value in case no match

    let finalCategory = '';

    if (testResult.testName === 'art') {
      finalActivity = testResult.finalArt;
      finalCategory = 'Art';
    } else if (testResult.testName === 'sport') {
      finalActivity = testResult.finalSport;
      finalCategory = 'Sport';
    } else if (testResult.testName === 'indoor') {
      finalActivity = testResult.finalIndoorActivity;
      finalCategory = 'Indoor';
    } else if (testResult.testName === 'outdoor') {
      finalActivity = testResult.finalOutdoorActivity;
      finalCategory = 'Outdoor';
    } else if (testResult.testName === 'languages') {
      finalActivity = testResult.finalLanguages;
      finalCategory = 'Languages';
    }


    // Trimitem răspunsul doar o singură dată
    response = res.json({
      message: 'Rezultatul testului a fost gasit cu succes.',
      finalActivity, // Afișăm activitatea finală găsită
       finalCategory,
      username: testResult.username,
      testname: testResult.testName,
      email: testResult.email,
      status: testResult.status,
      sportScores: testResult.sportScores,
      indoorScores: testResult.indoorScores,  
      outdoorScores: testResult.outdoorScores,
      artScores: testResult.artScores,
      languagesScores: testResult.languagesScores
      
    });

  } catch (error) {
    console.error('Eroare la obtinerea rezultatului:', error);
    response = res.status(500).json({ message: 'Eroare la procesarea cererii.' });
  }

  // Verificăm dacă răspunsul nu a fost deja trimis
  if (response) {
    return response;
  }
};

module.exports = { saveTestResult, getTestResult };
