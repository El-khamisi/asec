const mongoose = require('mongoose');
const { levels, membership, categories } = require('../../config/puplic_config');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    thumb: { type: String },
    instructor: { _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, name: { type: String, trim: true } },
    description: {
      _id: false,
      text: { type: String, trim: true },
      list: { type: [String], trim: true },
    },
    price: {
      _id: false,
      usd: { type: Number, set: (v) => Math.round(v * 100) / 100, default: 0.0 },
      egp: { type: Number, set: (v) => Math.round(v * 100) / 100, default: 0.0 },
      last_exchange: { type: Number, set: (v) => Math.round(v * 100) / 100, default: 0.0 },
    },
    rating: {
      _id: false,
      total_rate: { type: Number, default: 0 },
      avg_rate: { type: Number, set: (v) => Math.round(v * 10) / 10, default: 0.0 },
    },
    membership: { type: String, enum: [...membership, 'Invalid membership'], default: membership[0] },
    level: { type: String, enum: [...levels.map((e) => e.type), 'Invalid level'] },
    category: { type: String, enum: [...categories, 'Invalid category'] },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    spec: { type: mongoose.Schema.Types.ObjectId, ref: 'Spec' },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
//check if virtuals are working

courseSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'course_id',
});

courseSchema.virtual('quizzes', {
  ref: 'Quiz',
  localField: '_id',
  foreignField: 'course_id',
});

courseSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'course_id',
});
module.exports = mongoose.model('Course', courseSchema);
