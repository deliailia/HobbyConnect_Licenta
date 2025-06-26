const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  testName: String,
  questions: Array,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sportScores: {
    Soccer: { type: Number, default: 0 },
    Volleyball: { type: Number, default: 0 },
    Basketball: { type: Number, default: 0 },
    Pilates: { type: Number, default: 0 },
  },
  indoorScores: {
    Music: { type: Number, default: 0 },
    Gaming: { type: Number, default: 0 },
    Movie: { type: Number, default: 0 },
  },
  outdoorScores: {
    Travelling: { type: Number, default: 0 },
    Walking: { type: Number, default: 0 },
    Coffee: { type: Number, default: 0 },
    Food: { type: Number, default: 0 },
  },
  artScores: {
    Photography: { type: Number, default: 0 },
    Drawing: { type: Number, default: 0 },
    Compositor: { type: Number, default: 0 },
    Choreography: { type: Number, default: 0 },
  },
  languagesScores: {
    French: { type: Number, default: 0 },
    Italian: { type: Number, default: 0 },
    Spanish: { type: Number, default: 0 },
    Korean: { type: Number, default: 0 },
    Norvegian: { type: Number, default: 0 },
  },
  finalSport: String,
  finalIndoorActivity: String,
  finalOutdoorActivity: String,
  finalArt: String,
  finalLanguages: String,
  username: String,
  email: String,
  status: {
  type: Number,
  enum: [0, 1], // doar 0 sau 1
  default: 0,    // implicit e 0 (netestat)
},
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TestResult', testResultSchema);
