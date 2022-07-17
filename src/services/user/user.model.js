const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');

//configuration
const { TOKENKEY, NODE_ENV } = require('../../config/env');
const roles = require('../../config/roles');
const { subscriptions } = require('../../config/public_config');

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, trim: true, required: true },
    last_name: { type: String, trim: true },
    email: { type: String, trim: true, required: [true, 'Email is required'], unique: true, validate: [validator.isEmail, 'Invalid Email'] },
    phone: { type: String },
    password: { type: String, required: [true, 'Password is required'] },
    is_verified: { type: Boolean, default: false },
    //
    role: { type: String, enum: Object.values(roles), default: roles.Student },
    about: { type: String, trim: true },
    rating: {
      _id: false,
      total_rate: { type: Number, default: 0 },
      avg_rate: { type: Number, set: (v) => Math.round(v * 10) / 10, default: 0.0 },
    },
    photo: { type: String },
    courses: [
      {
        course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true }],
        is_completed: { type: Boolean, default: false },
        total_mark: { type: Number, default: 0 },
        subscription: {
          _id: false,
          type: { type: String, enum: Object.values(subscriptions), require: true },
          expires_at: Date,
        },
        installment_months: { type: Number, default: 0 },
        remaining_cost: Number,
        payment_type: String,
      },
    ],
    specs: [
      {
        spec_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Spec', required: true },
        courses: [mongoose.Schema.Types.ObjectId],
        is_completed: { type: Boolean, default: false },
        total_mark: { type: Number, default: 0 },
        subscription: {
          _id: false,
          type: { type: String, enum: Object.values(subscriptions), require: true },
          expires_at: Date,
        },
        installment_months: { type: Number, default: 0 },
        remaining_cost: Number,
        payment_type: String,
      },
    ],
  },
  { strict: false, timestamps: true }
);

userSchema.methods.generateToken = function (req, res) {
  const token = jwt.sign(
    {
      id: this._id,
      name: this.first_name + ' ' + this.last_name,
      email: this.email,
      photo: this.photo,
      role: this.role,
    },
    TOKENKEY,
    { expiresIn: '7d' }
  );

  return token;
};

//Exclude findOne for Login password
userSchema.post(['save', 'find', 'findByIdAndUpdate', 'findByIdAndDelete'], function (doc, next) {
  if (!doc) {
    next();
  } else if (doc.length && doc.length > 0) {
    doc.forEach((e, i) => {
      doc[i].password = undefined;
    });
  } else {
    doc.password = undefined;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
