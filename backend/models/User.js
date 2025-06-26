const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // pentru criptarea parolelor

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String,  
    enum: ['user', 'admin_small', 'admin_master'],
    default: 'user'
  },
  aboutMe: { type: String, default: '' },
  profileImage: { 
    type: String, 
    default: 'https://res.cloudinary.com/demo/image/upload/v1654520930/default-profile.jpg' 
  },
  profileImageUploadedBy: { type: String }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Criptarea parolei
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Verificarea parolei criptate la logare
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Crearea modelului pe baza schemei
const User = mongoose.model('User', userSchema);

module.exports = User;
