const mongoose = require('mongoose');
const { levels, memberships, categories } = require('../../config/public_config');

const allowed = ['days', 'weeks', 'months', 'years'];
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true, unique: true, index: true },
    thumb: { type: String },
    instructor: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, trim: true },
    },
    description: {
      _id: false,
      text: { type: String, trim: true },
      list: { type: [String], trim: true },
    },
    price: {
      _id: false,
      usd: { type: Number, set: (v) => Math.round(v * 100) / 100, default: 0.0 },
      egp: { type: Number, set: (v) => Math.round(v * 100) / 100, default: 0.0 },
      last_exchange: { type: Date },
    },
    rating: {
      _id: false,
      total_rate: { type: Number, default: 0 },
      avg_rate: { type: Number, set: (v) => Math.round(v * 10) / 10, default: 0.0 },
    },
    cashback: [
      {
        _id: false,
        duration: {
          type: String,
          trim: true,
          required: true,
          validate: {
            validator: function (v) {
              return allowed.find((e) => v.split(e).length == 2 && v.split(' ').length == 2);
            },
            message: (e) => `Invalid input duration ${e} should be in form: {14 [days/weeks/ months/ years]}`,
          },
        },
        rate: { type: Number, required: true, set: (v) => Math.round(v * 10) / 10 },
      },
    ],
    membership: { type: String, enum: memberships, default: memberships[0] },
    level: { type: String, enum: levels.map((e) => e.type) },
    category: { type: String, enum: categories, index: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    spec: { type: mongoose.Schema.Types.ObjectId, ref: 'Spec' },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
//check if virtuals are working

courseSchema.virtual('quizzes', {
  ref: 'Quiz',
  localField: '_id',
  foreignField: 'course_id',
});

module.exports = mongoose.model('Course', courseSchema);
