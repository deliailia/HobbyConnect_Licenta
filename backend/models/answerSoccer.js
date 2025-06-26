const mongoose = require('mongoose');

const answerSoccerSchema = new mongoose.Schema({
  option: { type: String, required: true }, 
  group: { type: String, required: true }, 
  category: { type: String, required: true }, 
});

const AnswerSoccer = mongoose.model('AnswerSoccer', answerSoccerSchema);

module.exports = AnswerSoccer;
