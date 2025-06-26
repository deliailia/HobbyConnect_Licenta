const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  groupName: { type: String, required: true },
  subcategoryName: { type: String, required: true },
  text: { type: String, required: true }, 
  timestamp: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('Message', messageSchema);