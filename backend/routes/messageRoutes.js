const express = require('express');
const { sendMessage, getMessages, sendImage, getImages, getMessagesByGroup } = require('../controllers/messageController');
const verifyToken = require('../middleware/tokenUse'); 
const { upload } = require('../cloudConfig'); // multer memory storage

const router = express.Router();

router.post('/send', sendMessage);

router.get('/:groupName/:subcategoryName', getMessages);

router.post('/send-image', upload.single('image'), sendImage);

router.get('/images/:groupName/:subcategoryName', getImages);


module.exports = router;
