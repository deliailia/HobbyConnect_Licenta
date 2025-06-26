const Request = require('../models/Request');
const User = require('../models/User');

const sendRequest = async (req, res) => {
  const { username, adminId, categoryName, subcategoryName, userReqId} = req.body; 

  if ( !username || !adminId  || !categoryName || !subcategoryName || !userReqId ) {
    return res.status(400).json({ error: ' username, adminId   categ si subcateg sunt necesare!' });
  }

  try {
    // Caută utilizatorul după username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'Utilizatorul nu a fost găsit.' });
    }

    // Extrage profileImage din user, dacă există
    const profileImage = user.profileImage || '';

    // Creează cererea cu profileImage preluat din user
    const newRequest = new Request({ 
      username, 
      adminId, 
      categoryName, 
      subcategoryName, 
      userReqId, 
      profileImage 
    });

    await newRequest.save();

    res.status(201).json({ message: 'Cererea a fost trimisă cu succes!' });
  } catch (error) {
    console.error('Eroare la salvarea cererii:', error);
    res.status(500).json({ error: 'Eroare internă a serverului.' });
  }
};

const getRequests = async (req, res) => {
  try {
    const { adminId } = req.query; 

    if (!adminId) {
      return res.status(400).json({ error: 'Trebuie sa specifici adminId' });
    }

    const requests = await Request.find({ adminId });

    if (!requests.length) {
      return res.status(404).json({ message: 'Nu au fost gasite cereri pentru acest adminId.' });
    }

    res.status(200).json(requests); 
  } catch (error) {
    console.error('Eroare la obtinerea cererilor:', error);
    res.status(500).json({ error: 'Eroare interna a serverului.' });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { userReqId } = req.params; // sau req.body, în funcție cum trimiți

    if (!userReqId) {
      return res.status(400).json({ error: 'userReqId este necesar pentru ștergere.' });
    }

    const deletedRequest = await Request.findOneAndDelete({ userReqId });

    if (!deletedRequest) {
      return res.status(404).json({ error: 'Cererea nu a fost găsită.' });
    }

    res.status(200).json({ message: 'Cererea a fost ștearsă cu succes.', deletedRequest });
  } catch (error) {
    console.error('Eroare la ștergerea cererii:', error);
    res.status(500).json({ error: 'Eroare internă a serverului.' });
  }
};



module.exports = { sendRequest, getRequests, deleteRequest };
