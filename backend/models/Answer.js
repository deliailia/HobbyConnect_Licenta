

const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,  
  },
  selectedAnswer: {
    type: String,
    required: true, 
  },
}, { timestamps: true });  

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
