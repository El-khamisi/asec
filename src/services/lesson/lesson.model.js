const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true },
  read_url: { type: String },
  video_url: { type: String },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
});

module.exports = mongoose.model('Lesson', lessonSchema);
