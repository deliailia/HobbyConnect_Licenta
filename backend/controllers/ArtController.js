const Arts = require('../models/ArtModel'); 
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/tokenUse'); 

const getArtDetails = async (req, res) => {
  try {
    const { categoryName, subcategoryName } = req.params;

    const artGroup = await Arts.findOne({
      categoryName: categoryName,
      'subcategories.name': subcategoryName,
    });
    console.log('Am primit cerere pentru:', categoryName, subcategoryName);

    if (!artGroup) {
      return res.status(404).json({ message: 'Grupul sau subcategoria nu sunt gasite' });
    }

    const subcategory = artGroup.subcategories.find(sub => sub.name === subcategoryName);
    return res.status(200).json(subcategory);
  } catch (error) {
    console.error('Eroare la obtinerea detaliilor despre grup:', error);
    return res.status(500).json({ message: 'Eroare interna' });
  }
};


const addUserToArtGroup = async (req, res) => {
  try {
    const { categoryName, subcategoryName, username, userReqId } = req.body;


    console.log('Date primite:', { categoryName, subcategoryName, username, userReqId });

    // Căutăm grupul de artă și subcategoria corespunzătoare
    const artGroup = await Arts.findOne({
      categoryName: categoryName,
      'subcategories.name': subcategoryName,
    });

    if (!artGroup) {
      return res.status(404).json({ message: 'Grupul sau subcategoria nu sunt găsite' });
    }

    // Găsim subcategoria respectivă
    let subcategory = artGroup.subcategories.find(sub => sub.name === subcategoryName);

    // Verificăm dacă utilizatorul există deja în subcategorie
    const userExists = subcategory.members.some(member => member.username === username);
    if (userExists) {
      return res.status(400).json({ message: 'Utilizatorul este deja în acest grup' });
    }

    console.log('Adăugare utilizator în subcategorie:', { userReqId, username, joinedAt: new Date() });

    // Adăugăm utilizatorul în lista membrilor
    subcategory.members.push({ userReqId, username, joinedAt: new Date() });

    // Salvăm modificările în baza de date
    await artGroup.save();

    return res.status(201).json({ message: 'Utilizatorul a fost adăugat cu succes!' });
  } catch (error) {
    console.error('Eroare la adăugarea utilizatorului în grup:', error);
    return res.status(500).json({ message: 'Eroare internă' });
  }
};

const removeUserFromArtGroup = async (req, res) => {
  try {
    // Extragem datele din corpul cererii
    const { categoryName, subcategoryName, username } = req.body;
    console.log('Date primite pentru ștergere:', { categoryName, subcategoryName, username });

    // Căutăm grupul de artă și subcategoria corespunzătoare
    const artGroup = await Arts.findOne({
      categoryName: categoryName,
      'subcategories.name': subcategoryName,
    });

    if (!artGroup) {
      return res.status(404).json({ message: 'Grupul sau subcategoria nu sunt găsite' });
    }

    // Găsim subcategoria respectivă
    const subcategory = artGroup.subcategories.find(sub => sub.name === subcategoryName);

    // Verificăm dacă utilizatorul există în subcategorie
    const memberIndex = subcategory.members.findIndex(member => member.username === username);

    if (memberIndex === -1) {
      return res.status(400).json({ message: 'Utilizatorul nu este în acest grup' });
    }

    // Ștergem utilizatorul din lista membrilor
    subcategory.members.splice(memberIndex, 1);

    // Salvăm modificările în baza de date
    await artGroup.save();

    return res.status(200).json({ message: 'Utilizatorul a fost șters cu succes!' });
  } catch (error) {
    console.error('Eroare la ștergerea utilizatorului din grup:', error);
    return res.status(500).json({ message: 'Eroare internă' });
  }
};

module.exports = {
  getArtDetails,
  addUserToArtGroup,
  removeUserFromArtGroup,
};
