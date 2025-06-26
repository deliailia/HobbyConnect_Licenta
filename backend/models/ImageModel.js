const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  groupName: { type: String, required: true },
  subcategoryName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', imageSchema);