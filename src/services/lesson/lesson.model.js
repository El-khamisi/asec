const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true },
  video_url: { type: String },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  commments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = mongoose.model('Lesson', lessonSchema);
