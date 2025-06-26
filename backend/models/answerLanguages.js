const mongoose = require('mongoose');

const answerLanguagesSchema = new mongoose.Schema({
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

const AnswerLanguages = mongoose.model('AnswerLanguages', answerLanguagesSchema);

module.exports = AnswerLanguages;