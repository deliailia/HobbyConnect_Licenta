const mongoose = require('mongoose');

const qSchema = new mongoose.Schema({
    question: { type: String, required: true,},
    category: { type: String, required: true,},
    options: {
        type: [String],
        required: true,
    },
    givenresp: {
        type: [String],
        required: true,
    },
    statusq: {
        type: String,
        enum: ['active', 'inactive'],
    }
  });

  const Questions = mongoose.model('Questions', qSchema);

  module.exports = Questions;