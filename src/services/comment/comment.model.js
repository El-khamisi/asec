const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    parent_id: { type: mongoose.Schema.Types.ObjectId },
    user: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, trim: true, required: true },
      photo: { type: String },
    },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
