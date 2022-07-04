const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    user: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, trim, required: true },
      photo: { type: String, required: true },
    },
    likes: { type: Number, default: 0 },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
