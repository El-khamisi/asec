const { subscriptions, Subscription } = require('./subscription.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getSubscriptions = async (req, res) => {
  try {
    const response = await Subscription.find({}).exec();
    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateOrAddSubscription = async (req, res) => {
  try {
    // duration: ['4 days', '2 weeks']
    const { title, duration, cashback_rate, description_text, description_list } = req.body;
    if (title == subscriptions.cashBack && (!duration || !cashback_rate) && duration.length == cashback_rate.length)
      throw new Error('Cashback Plan should have duration && cashback_rate and must be provide cashback_rate for each duration ');

    const discounts = duration.forEach((e, i) => {
      return { duration: e, cashback_rate: cashback_rate[i] };
    });

    const response = await Subscription.findOneAndUpdate(
      { title },
      {
        title,
        discounts,
        description: { text: description_text, description_list },
      },
      { upsert: true }
    );

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
