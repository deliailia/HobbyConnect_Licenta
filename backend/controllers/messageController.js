const Message = require('../models/message');
const Arts = require('../models/ArtModel');
const jwt = require('jsonwebtoken'); 
const { JWT_SECRET } = process.env;
const {  cloudinary } = require('../cloudConfig'); // importă multer și cloudinary
const streamifier = require('streamifier');
const {upload} = require('../cloudConfig'); 
const Image = require('../models/ImageModel');



const sendImage = async (req, res) => {
  try {
    const { username, groupName, subcategoryName } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Imaginea este necesară' });
    }
    if (!username || !groupName || !subcategoryName) {
      return res.status(400).json({ error: 'Username, groupName și subcategoryName sunt necesare' });
    }

    // Verifică dacă grupul și subcategoria există
    const artsGroup = await Arts.findOne({ categoryName: groupName });
    if (!artsGroup) {
      return res.status(404).json({ error: 'Grupul nu a fost gasit' });
    }
    const subcategory = artsGroup.subcategories.find(sub => sub.name === subcategoryName);
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategoria nu a fost gasita' });
    }

    // Încarcă imaginea în Cloudinary
    const uploadFromBuffer = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: subcategoryName },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await uploadFromBuffer(req.file.buffer);
    const newImage = new Image({
      username,
      groupName,
      subcategoryName,
      imageUrl: result.secure_url,
    });
    await newImage.save();


    res.status(200).json({
      message: 'Imagine încărcată cu succes',
      data: {
        username,
        groupName,
        subcategoryName,
        imageUrl: result.secure_url,
      }
    });

    //res.status(201).json({ message: 'Imagine trimisă cu succes', data: newMessage });
  } catch (error) {
    console.error('Eroare la trimiterea imaginii:', error);
    res.status(500).json({ error: 'Eroare internă la server' });
  }
};

const sendMessage = async (req, res) => {
  

  try {
    const { username, groupName, subcategoryName, messageText } = req.body;
    if (!username || !messageText) {
      return res.status(400).json({ error: 'Username și mesajul sunt necesare' });
    }
    
    
    console.log('Mesaj primit:', req.body); 

    const artsGroup = await Arts.findOne({ categoryName: groupName });
    if (!artsGroup) {
      return res.status(404).json({ error: 'Grupul nu a fost gasit' });
    }

    const subcategory = artsGroup.subcategories.find(sub => sub.name === subcategoryName);
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategoria nu a fost gasita' });
    }

    const newMessage = new Message({
      username: username,
      groupName: groupName,
      subcategoryName: subcategoryName,
      text: messageText,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Mesaj trimis cu succes', data: newMessage });
  } catch (error) {
    console.error('Eroare la trimiterea mesajului:', error);
    res.status(500).json({ error: 'Eroare interna la server' });
  }
};


const getMessages = async (req, res) => {
  try {
    const { groupName, subcategoryName } = req.params;
    const messages = await Message.find({
      groupName: groupName,
      subcategoryName: subcategoryName,
    });

    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: 'No messages found' });
    }

    // const messagesWithUsernames = messages.map((message) => {
    //   return {
    //     ...message._doc,
    //     username: decoded.username, 
    //   };
    // });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Eroare la obtinerea mesajelor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getImages = async (req, res) => {
  try {
    const { groupName, subcategoryName } = req.params;

    if (!groupName || !subcategoryName) {
      return res.status(400).json({ error: 'groupName și subcategoryName sunt necesare' });
    }

    const images = await Image.find({ groupName, subcategoryName }).sort({ createdAt: -1 });

    res.status(200).json({ images });
  } catch (error) {
    console.error('Eroare la preluarea imaginilor:', error);
    res.status(500).json({ error: 'Eroare internă la server' });
  }
};


module.exports = {
  sendImage,
  sendMessage,
  getMessages,
  getImages
};