const express = require('express');
const verifyToken = require('../middleware/tokenUse');  
const { saveTestResult } = require('../controllers/testResultController');  
const { getTestResult } = require('../controllers/testResultController');  

const router = express.Router();


router.post('/saveTestResult', saveTestResult); 

router.get('/getTestResult/:username',  getTestResult);  

module.exports = router;
