const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    questions: [
      {
        question_name: { type: String },
        options: { type: Map, of: String },
        answer: { type: String, required: true },
      },
    ],
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  },
  { timestamps: true }
);

quizSchema.pre('save', function (next) {
  if (!this.questions.options) {
    next();
  } else {
    this.questions.options.forEach((v, k) => {
      if (k == this.answer) next();
    });
  }
  throw new Error('Provide a correct Answer key');
});
module.exports = mongoose.model('Quiz', quizSchema);
