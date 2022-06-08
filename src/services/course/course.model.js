const mongoose = require('mongoose');
const {levels} = require('../../config/puplic_config');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    thumb: { type: String },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: String,
    price_egp: { type: Number, set: (v) => Math.round(v * 100) / 100, default: 0.0 },
    level: { type: String, enum: [levels.map(e=>e.type), 'Invalid level'] },
    project_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    spec: {type: mongoose.Schema.Types.ObjectId, ref: 'Spec'},
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
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

module.exports = mongoose.model('Course', courseSchema);
