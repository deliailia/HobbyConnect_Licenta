const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  username: { type: String, required: true },
  adminId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  categoryName: { type: String, required: true },
  subcategoryName: { type: String, required: true },
  userReqId: { type: String, required: true },
  profileImage: { type: String, default: '' }, // 👈 AICI
});

module.exports = mongoose.model('Request', RequestSchema);
