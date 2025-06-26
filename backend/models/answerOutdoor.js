const mongoose = require('mongoose');

const answerOutdoorSchema = new mongoose.Schema({
  option: {
    type: String,
    required: true
  },
  group: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const AnswerOutdoor = mongoose.model('AnswerOutdoor', answerOutdoorSchema);

module.exports = AnswerOutdoor;