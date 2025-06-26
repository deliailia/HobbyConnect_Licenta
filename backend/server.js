require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurare Multer pentru upload în Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pictures', // Folderul unde se vor salva imaginile
    allowedFormats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage });

const authRoutes = require('./routes/authRoutes');
const QARoutes = require('./routes/QARoutes');
const answerRoutes = require('./routes/answerRoutes');
const verifyToken = require('./middleware/tokenUse');
const userRoutes = require('./routes/userRoutes');
const testResultRoutes = require('./routes/testResultRoute');
const requestRoutes = require('./routes/requestRoutes'); 
const artRoutes = require('./routes/ArtRoutes');
const messageRoutes = require('./routes/messageRoutes'); 
const eventRoutes = require('./routes/eventRoutes'); // Importă rutele pentru evenimente
const savedEventsRoutes = require('./routes/savedEventsRoutes');
const mbtiRoutes = require('./routes/mbtiRoutes'); // importă ruta MBTI
const pollRoutes = require('./routes/pollRoutes');

const jwtSecret = process.env.JWT_SECRET;

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' })); 

mongoose.connect('mongodb://192.168.56.1:27017/HobbyConnectDB', {})
  .then(() => {
    console.log('Conectat la MongoDB');
  })
  .catch((err) => {
    console.error('Eroare la conectarea la MongoDB:', err);
  });


app.use('/api/auth', authRoutes);
app.use('/api/questions', QARoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/testResults', testResultRoutes);
app.use('/api/requests', requestRoutes); 
app.use('/api/arts', artRoutes);
app.use('/api/messages', messageRoutes); 
app.use('/api', eventRoutes);
app.use('/api/saved-events', savedEventsRoutes);
app.use('/api', mbtiRoutes);
app.use('/api', pollRoutes);



app.get('/', (req, res) => {
  res.send('Backendul functioneaza!');
});

app.listen(5000, '0.0.0.0', () => {
  console.log(`Serverul ruleaza pe portul 5000`);
});
