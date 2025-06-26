const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savedEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  savedBy: [
    {
      type: String, // username-urile celor care au salvat evenimentul
    },
  ],
});

const SavedEvent = mongoose.model('SavedEvent', savedEventSchema);
module.exports = SavedEvent;
