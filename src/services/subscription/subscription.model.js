const mongoose = require('mongoose');

const subscriptions = {
  free: 'free',
  studentSupport: 'student support',
  cashBack: 'cash back',
  lifeTime: 'life time access',
};
const subscriptionSchema = new mongoose.Schema({
  title: { type: String, enum: Object.values(subscriptions), required: true, unique: true },
  discounts: [
    {
      _id: false,
      duration: { type: String, trim: true, required: true },
      cashback_rate: { type: Number, required: true, set: (v) => Math.round(v * 10) / 10 },
    },
  ],
  description: {
    _id: false,
    text: { type: String, trim: true },
    list: { type: [String], trim: true },
  },
});

module.exports = {
  Subscription: mongoose.model('Subscription', subscriptionSchema),
  subscriptions,
};
