const mongoose = require('mongoose');

const specSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true },
  description: { type: String, trim: true },
  rating: {
    _id: false,
    total_rate: { type: Number, default: 0 },
    avg_rate: { type: Number, set: (v) => Math.round(v * 10) / 10, default: 0.0 },
  },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

module.exports = mongoose.model('Spec', specSchema);
