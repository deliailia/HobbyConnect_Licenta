const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  description: { type: String }, 
  members: [
    {
      userReqId: { type: String}, 
      username: { type: String }, 
      joinedAt: { type: Date, default: Date.now }, 
    },
  ],
});

const ArtsSchema = new mongoose.Schema({
  categoryName: { type: String, required: true},
  subcategories: [SubcategorySchema], 
});

module.exports = mongoose.model('Arts', ArtsSchema);
