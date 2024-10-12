const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  venue: { type: String, required: true },
  host: { type: String, required: true },
  startDate: { type: Date, required: true },
  startTime: { type: String, required: true }, // Changed to String to match the format from frontend
  endTime: { type: String, required: true },   // Changed to String to match the format from frontend
  description: { type: String, required: true },
  image: { type: String },  // Image path
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
