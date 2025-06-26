const mongoose = require('mongoose');

const memberVoteSchema = new mongoose.Schema({
  username: { type: String, required: true },
  choice: { type: String, required: true }
}, { _id: false });

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  subcategoryName: { type: String, required: true },
  groupName: { type: String, required: true },
  createdBy: { type: String, required: true },
  options: {
    type: [String],
    default: ['yes', 'no'], // opțiuni implicite pentru poll-urile simple
    validate: {
      validator: function (arr) {
        return arr.length >= 2;
      },
      message: 'Trebuie să existe cel puțin două opțiuni pentru un poll.'
    }
  },
  members: [memberVoteSchema],
  createdAt: { type: Date, default: Date.now }
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
