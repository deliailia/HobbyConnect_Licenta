const express = require('express');
const router = express.Router();
const artsController = require('../controllers/ArtController'); 
const authenticateToken = require('../middleware/tokenUse'); 

router.get('/:categoryName/:subcategoryName', artsController.getArtDetails);

router.post('/add-user', artsController.addUserToArtGroup);

router.delete('/remove-user', artsController.removeUserFromArtGroup);

module.exports = router;
