const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  content_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  content_type: { type: String, enum: ['courses', 'counsulting'], trim: true, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user_name: { type: String, trim: true, default: 'Anonymous' },
  user_thumb: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  text: { type: String, trim: true },
});

module.exports = mongoose.model('Review', reviewSchema);
