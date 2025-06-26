const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = new mongoose.Schema({
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  });
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: locationSchema,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  participants: [
    {
      type: String,
    },
  ],
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
