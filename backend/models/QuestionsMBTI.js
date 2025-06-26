const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  tip: {
    type: String,
    enum: ['I', 'E', 'S', 'N', 'T', 'F', 'J', 'P'],
    required: true
  },
  category: { type: String, required: true },
  options: {
    type: [String],
    default: [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ]
  }
});

const QuestionsMBTI = mongoose.model('QuestionsMBTI', questionSchema, 'questionsmbti'); // 'questionsmbti' este colecția exactă

module.exports = QuestionsMBTI;