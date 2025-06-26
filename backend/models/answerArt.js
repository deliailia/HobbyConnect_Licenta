const mongoose = require('mongoose');

const answerArtSchema = new mongoose.Schema({
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

const AnswerArt = mongoose.model('AnswerArt', answerArtSchema);

module.exports = AnswerArt;