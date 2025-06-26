const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');  // Multer pentru upload direct în server
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { updateProfileImage, getProfileByUsername } = require('../controllers/userController');
require('dotenv').config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//const storage = multer.memoryStorage();
const upload = multer({ storage: multer.memoryStorage() });

router.put('/upload-image', upload.single('image'), async (req, res) => {  
  try {
    if (!req.file) {
      console.log('❌ Nicio imagine încărcată');
      return res.status(400).json({ message: 'Nicio imagine încărcată' });
    }

    console.log('🔍 Email din cerere:', req.body.email);

    // Căutăm utilizatorul în baza de date folosind email-ul
    const user = await User.findOne({ email: req.body.email });

    // Dacă utilizatorul nu a fost găsit
    if (!user) {
      console.log('❌ Utilizatorul nu a fost găsit!');
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    console.log('🔍 Utilizator găsit:', user);

    // Dacă utilizatorul are deja o imagine de profil
    if (user.profileImage) {
      let stream = cloudinary.uploader.upload_stream(
        { folder: 'profile_pictures' },  
        async (error, result) => {
          if (error) {
            console.error('Eroare la upload:', error);
            return res.status(500).json({ message: 'Eroare la încărcarea imaginii' });
          }

          user.profileImage = result.secure_url;
          await user.save();

          res.status(200).json({ message: 'Imagine actualizată cu succes', profileImage: result.secure_url });
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {
      let stream = cloudinary.uploader.upload_stream(
        { folder: 'profile_pictures' },  
        async (error, result) => {
          if (error) {
            console.error('Eroare la upload:', error);
            return res.status(500).json({ message: 'Eroare la încărcarea imaginii' });
          }

          user.profileImage = result.secure_url;
          await user.save();

          res.status(200).json({ message: 'Imagine încărcată cu succes', profileImage: result.secure_url });
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    }
  } catch (err) {
    console.error('❌ Eroare la procesarea cererii:', err);
    res.status(500).json({ message: 'Eroare la procesarea cererii' });
  }
});


router.get('/', async (req, res) => {  // Am eliminat verifyToken
  try {
    const users = await User.find();  
    res.status(200).json(users);  
  } catch (err) {
    res.status(500).json({ message: 'Eroare la obtinerea utilizatorilor' });
  }
});


router.get('/:username', async (req, res) => {  // Am eliminat verifyToken
  try {
    const user = await User.findOne({ username: req.params.username });  // Căutăm utilizatorul după username

    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    res.status(200).json(user);  // Returnează datele utilizatorului găsit
  } catch (err) {
    res.status(500).json({ message: 'Eroare la obținerea utilizatorului' });
  }
});

router.put('/:username', async (req, res) => {  // Am eliminat verifyToken
  try {
    const user = await User.findOne({ username: req.params.username }); 
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    // Dacă utilizatorul autenticat nu este același cu cel care dorește să facă modificarea
    if (user.username !== req.body.username) { 
      return res.status(403).json({ message: 'Nu ai permisiunea să modifici acest profil.' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.username },
      req.body, 
      { new: true }
    );

    res.status(200).json(updatedUser);  
  } catch (err) {
    console.error('Eroare la actualizarea utilizatorului:', err);
    res.status(500).json({ message: 'Eroare la actualizarea utilizatorului' });
  }
});


// Șterge un utilizator după username
router.delete('/:username', async (req, res) => {  // Am eliminat verifyToken
  try {
    const user = await User.findOne({ username: req.params.username });  // Căutăm utilizatorul după username
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    // Verificăm dacă utilizatorul care face cererea are permisiunea să șteargă acest cont
    if (user.username !== req.body.username) { // Verificăm username-ul din body
      return res.status(403).json({ message: 'Nu ai permisiunea să ștergi acest profil.' });
    }

    // Ștergem utilizatorul
    await User.deleteOne({ username: req.params.username });
    res.status(200).json({ message: 'Profil șters cu succes.' });
  } catch (err) {
    console.error('Eroare la ștergerea utilizatorului:', err);
    res.status(500).json({ message: 'Eroare la ștergerea utilizatorului' });
  }
});
// Căutare utilizator după email
router.get('/by-email/:email', async (req, res) => {
  try {
    const email = req.params.email;

    // Căutăm utilizatorul în baza de date după email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    console.log('User found:', user);

    res.status(200).json({
      userId: user._id, // Trimite userId-ul din MongoDB
      username: user.username,
      role: user.role, // Include rolul utilizatorului
      email: user.email,
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error('Eroare la obținerea utilizatorului:', err);
    res.status(500).json({ message: 'Eroare la obținerea utilizatorului' });
  }
});
router.put('/update-profile', upload.single('image'), async (req, res) => {
  console.log('🔧 Cerere primită la /update-profile');

  try {
    const { email, username, aboutMe, } = req.body;
    console.log("Email primit din req.body:", email);

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email invalid sau lipsă' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    console.log('🔧 Email normalizat:', normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });
    console.log('🔧 Utilizator găsit:', user);

    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit.' });
    }

    if (username) user.username = username;
    if (aboutMe) user.aboutMe = aboutMe;

    if (req.file) {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'profile_pictures' },
        async (error, result) => {
          if (error) {
            console.error('Eroare la upload-ul imaginii:', error);
            return res.status(500).json({ message: 'Eroare la încărcarea imaginii.' });
          }

          user.profileImage = result.secure_url;
          await user.save();

          return res.status(200).json({
            message: 'Profil actualizat cu succes (cu imagine)',
            profileImage: result.secure_url,
            user: {
              username: user.username,
              aboutMe: user.aboutMe,
              profileImage: user.profileImage,
            },
          });
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {
      await user.save();
      return res.status(200).json({
        message: 'Profil actualizat cu succes (fără imagine)',
        user: {
          username: user.username,
          aboutMe: user.aboutMe,
          profileImage: user.profileImage,
        },
      });
    }
  } catch (err) {
    console.error('❌ Eroare la actualizarea profilului:', err);
    return res.status(500).json({ message: 'Eroare internă la actualizarea profilului.' });
  }
});

router.patch('/update-profile', upload.single('image'), async (req, res) => {
  console.log('🔧 Cerere primită la /update-profile (PATCH)');

  try {
    const { email, username, aboutMe } = req.body;
    console.log("Email primit din req.body:", req.body.email);
    console.log("Username primit din req.body:", username);
    console.log("AboutMe primit din req.body:", aboutMe);

    // Verificăm dacă email-ul este furnizat
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email invalid sau lipsă' });
    }

    //const normalizedEmail = email.trim().toLowerCase();
    //console.log('🔧 Email primit (normalizat):', normalizedEmail);

    // Căutăm utilizatorul în baza de date
    const user = await User.findOne({ email: email });

    // Log pentru a vedea ce se întoarce de la baza de date
    console.log('🔧 Utilizator găsit:', user);

    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit.' });
    }

    // Actualizăm doar câmpurile trimise în cerere
    if (username) user.username = username;
    console.log("Username actualizat:", user.username);
    if (aboutMe) user.aboutMe = aboutMe;
    console.log("AboutMe actualizat:", user.aboutMe);

    // Dacă s-a trimis o imagine
    if (req.file) {
      if (!req.file.buffer) {
        return res.status(400).json({ message: 'Fișierul încărcat este invalid.' });
      }

      // Încărcăm imaginea pe Cloudinary
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'profile_pictures' },
        async (error, result) => {
          if (error) {
            console.error('Eroare la upload-ul imaginii:', error);
            return res.status(500).json({ message: 'Eroare la încărcarea imaginii.' });
          }

          // Salvăm URL-ul imaginii în baza de date
          user.profileImage = result.secure_url;
          await user.save();

          return res.status(200).json({
            message: 'Profil actualizat cu succes (cu imagine)',
            profileImage: result.secure_url,
            user: {
              username: user.username,
              aboutMe: user.aboutMe,
              profileImage: user.profileImage,
            },
          });
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {
      // Dacă nu există imagine, doar actualizăm datele textuale
      await user.save();
      return res.status(200).json({
        message: 'Profil actualizat cu succes (fără imagine)',
        user: {
          username: user.username,
          aboutMe: user.aboutMe,
          profileImage: user.profileImage,
        },
      });
    }
  } catch (err) {
    console.error('❌ Eroare la actualizarea profilului (PATCH):', err);
    return res.status(500).json({ message: 'Eroare internă la actualizarea profilului.' });
  }
});
router.get('/by-username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    res.status(200).json({
      userId: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error('Eroare la obținerea utilizatorului după username:', err);
    res.status(500).json({ message: 'Eroare internă la obținerea utilizatorului.' });
  }
});

module.exports = router;
