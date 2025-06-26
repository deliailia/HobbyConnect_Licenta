const mongoose = require('mongoose');

const questionResultSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  tip: {
    type: String,
    enum: ['I', 'E', 'S', 'N', 'T', 'F', 'J', 'P'],
    required: true,
  }
});

const testResultMBTISchema = new mongoose.Schema({
  testName: String,
  questions: [questionResultSchema], // poți detalia schema întrebărilor dacă vrei
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Scorurile pentru fiecare tip MBTI
  scores: {
    I: { type: Number, default: 0 },
    E: { type: Number, default: 0 },
    S: { type: Number, default: 0 },
    N: { type: Number, default: 0 },
    T: { type: Number, default: 0 },
    F: { type: Number, default: 0 },
    J: { type: Number, default: 0 },
    P: { type: Number, default: 0 },
  },

  username: String,
  email: String,
    finalActivity: { type: String },  
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TestResultMBTI', testResultMBTISchema);
