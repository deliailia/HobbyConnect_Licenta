const express = require('express');
const router = express.Router();
//const multer = require('multer');
const authController = require('../controllers/authController');
//const { updateProfileImage } = require('../controllers/userController');
//const { upload } = require('../cloudConfig');  // Importăm upload-ul configurat cu CloudinaryStorage

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Rută pentru încărcarea imaginii de profil
//router.put('/update-profile', upload.single('image'), updateProfileImage);

module.exports = router;
