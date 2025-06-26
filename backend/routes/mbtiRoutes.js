const express = require('express');
const router = express.Router();
const { saveMBTITestResult, getMBTIQuestions, getTestResultMBTI, addAnalyzeTest, getAnalysisByFinalActivity } = require('../controllers/mbtiController');

router.get('/mbti-questions', getMBTIQuestions);
router.post('/saveResult', saveMBTITestResult);
router.get('/getTestResultMBTI/:username', getTestResultMBTI);
router.post('/add-analyze-test', addAnalyzeTest);
router.get('/analysis/:finalActivity', getAnalysisByFinalActivity);


module.exports = router;
