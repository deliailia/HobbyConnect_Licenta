const express = require('express');
const { sendRequest, getRequests, deleteRequest } = require('../controllers/requestController');
const tokenUse = require('../middleware/tokenUse');

const router = express.Router();

router.post('/send-request', sendRequest);

router.get('/get-requests', getRequests);
router.delete('/delete-request/:userReqId', deleteRequest);


module.exports = router;
