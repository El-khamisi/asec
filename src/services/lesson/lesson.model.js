const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  read_url: { type: String },
  video_url: { type: String },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
});

module.exports = mongoose.model('Lesson', lessonSchema);
