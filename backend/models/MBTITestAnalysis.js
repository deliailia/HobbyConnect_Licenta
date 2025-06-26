const mongoose = require('mongoose');

const MBTITestAnalysisSchema = new mongoose.Schema({
  finalActivity: { type: String, required: true },
  adminUsername: { type: String, required: true },
  definition: { type: String, required: true },

  introduction: { type: String, required: true },
  traits: { type: String, required: true },
  lifestyle: { type: String, required: true },
  whatFitsYouBest: { type: String, required: true },

  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MBTITestAnalysis', MBTITestAnalysisSchema);
