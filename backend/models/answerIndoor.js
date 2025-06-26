const mongoose = require('mongoose');

const answerIndoorSchema = new mongoose.Schema({
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

const AnswerIndoor = mongoose.model('AnswerIndoor', answerIndoorSchema);

module.exports = AnswerIndoor;