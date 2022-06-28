const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user_name: { type: String, trim: true, default: 'Anonymous' },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  user_thumb: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  review_text: { type: String, trim: true },
});

module.exports = mongoose.model('Review', reviewSchema);
