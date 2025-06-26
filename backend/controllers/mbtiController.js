const QuestionsMBTI = require('../models/QuestionsMBTI');
const TestResultMBTI = require('../models/testResultMBTI'); // modelul nou pentru MBTI
const User = require('../models/User');
const MBTITestAnalysis = require('../models/MBTITestAnalysis');


const answerPoints = {
  "Strongly Disagree": 1,
  "Disagree": 2,
  "Neutral": 3,
  "Agree": 4,
  "Strongly Agree": 5,
};

const saveMBTITestResult = async (req, res) => {
  try {
    const { testName, questions, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize score counts for MBTI types
    const scores = {
      I: 0,
      E: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    // questions = [{ questionId, answer, type: "I" or "E" or "S" etc }]
    questions.forEach(({ answer, tip }, index) => {
        console.log(`Answer #${index}:`, answer);

  if (!answer) {
    console.warn(`Warning: answer is missing for question index ${index}`);
    
  }
  
      const points = answerPoints[answer] || 0;
 if (points === undefined) {
    console.warn(`Warning: answerPoints missing for answer '${answer}' at question index ${index}`);
  }
      if (tip && scores.hasOwnProperty(tip)) {
        scores[tip] += points;
            console.log(`Added ${points || 0} points to ${tip}, total now: ${scores[tip]}`);

      }else {
    console.warn(`Warning: scores does not have property ${tip} at question index ${index}`);
  }
    });
    console.log('Numar intrebari in backend:', req.body.questions.length);
const finalActivity = 
      (scores.I >= scores.E ? 'I' : 'E') +
      (scores.N >= scores.S ? 'N' : 'S') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');

    // Salvează în baza de date
    console.log('Scores calculated:', scores);
    const newTestResult = new TestResultMBTI({
      testName,
      questions,
      userId,
      scores,
      finalActivity,
      username: user.username,
      email: user.email,
    });

    await newTestResult.save();

    res.status(200).json({
      message: 'Test MBTI result saved successfully',
      scores,
      finalActivity,
    });
  } catch (error) {
    console.error('Error saving MBTI test result:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

async function getMBTIQuestions(req, res) {
  try {
    const questions = await QuestionsMBTI.find({});
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la preluarea întrebărilor', error });
  }
}

const getTestResultMBTI = async (req, res) => {
  try {
    const { username } = req.params;

    // Căutăm rezultatul testului după username
const testResults = await TestResultMBTI.find({ username: username }).sort({ date: -1 });

   

    res.status(200).json({
      message: 'Rezultatul testului MBTI obținut cu succes',
      testResults: testResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Eroare la obținerea rezultatului testului', error: error.message });
  }
};

const addAnalyzeTest = async (req, res) => {
  try {
const {
      finalActivity,
      adminUsername,
      definition,
      introduction,
      traits,
      lifestyle,
      whatFitsYouBest
    } = req.body;
    if (
      !finalActivity ||
      !adminUsername ||
      !definition ||
      !introduction ||
      !traits ||
      !lifestyle ||
      !whatFitsYouBest
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
     


    const newTest = new MBTITestAnalysis({
      finalActivity,
      adminUsername,
      definition,
      introduction,
      traits,
      lifestyle,
      whatFitsYouBest
    });

    await newTest.save();
    return res.status(201).json({ message: 'Analyze test saved successfully', data: newTest });

  } catch (error) {
    console.error('Error saving analyze test:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
const getAnalysisByFinalActivity = async (req, res) => {
  try {
    const { finalActivity } = req.params;

    if (!finalActivity) {
      return res.status(400).json({ message: 'finalActivity param is required' });
    }

    // Caută analiza în baza de date după finalActivity
    const analysis = await MBTITestAnalysis.findOne({ finalActivity: finalActivity.toUpperCase() });

    if (!analysis) {
      return res.status(404).json({ message: `No analysis found for finalActivity: ${finalActivity}` });
    }

    return res.status(200).json({ message: 'Analysis found', analysis });
  } catch (error) {
    console.error('Error fetching analysis by finalActivity:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { saveMBTITestResult, getMBTIQuestions, getTestResultMBTI, addAnalyzeTest, getAnalysisByFinalActivity };
