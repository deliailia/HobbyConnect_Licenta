const admin = require('firebase-admin');
const serviceAccount = require('../firebase/firebase-config.json'); // ajustează calea dacă e altundeva

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token lipsă!' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Eroare verificare Firebase token:', error.message);
    return res.status(403).json({ message: 'Token invalid Firebase!' });
  }
};

module.exports = verifyToken;
