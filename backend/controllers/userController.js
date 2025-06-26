const User = require('../models/User');
const { upload, cloudinary } = require('../cloudConfig');
const fs = require('fs');  // Pentru a șterge fișierul temporar


const getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params; 

    const user = await User.findOne({ username }); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        aboutMe: user.aboutMe,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
/*
const updateProfileImage = async (req, res) => {
  try {
    console.log('🔍 req.body:', req.body);
    console.log('🖼️ req.file:', req.file);

    const email = req.body.email;
    if (!email) {
      console.log('❌ Email missing din req.body!');
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Utilizatorul nu a fost găsit după email:', email);
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    // Actualizări
    if (req.body.username) user.username = req.body.username;
    if (req.body.aboutMe) user.aboutMe = req.body.aboutMe;
    if (req.file) user.profileImage = req.file.path;

    await user.save();

    return res.status(200).json({
      message: 'Profil actualizat cu succes',
      //profileImage: user.profileImage,
    });

  } catch (err) {
    console.error('❌ Eroare la updateProfileImage:', err);
    return res.status(500).json({ message: 'Eroare la salvarea profilului' });
  }
};

*/
module.exports = { getProfileByUsername };
