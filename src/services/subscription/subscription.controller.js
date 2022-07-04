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
    const { title, duration, cashback_rate } = req.body;
    if (title == subscriptions.cashBack && (!duration || !cashback_rate) && duration.length == cashback_rate.length)
      throw new Error('Cashback Plan should have duration && cashback_rate and must be provide cashback_rate for each duration ');

    if (title == subscriptions.cashBack) {
      const allowed = ['days', 'weeks', 'months', 'years'];
      duration.forEach((e) => {
        if (!allowed.find((ee) => e.split(ee).length == 2 && e.split(' ').length == 2))
          throw new Error(`Invalid input duration ${e} should be in form: {14 [days/weeks/ months/ years]}`);
      });
    }

    const discounts = duration.forEach((e, i) => {
      return { duration: e, cashback_rate: cashback_rate[i] };
    });
    const response = await Subscription.findOneAndUpdate(
      { title },
      {
        title,
        discounts,
      },
      { upsert: true }
    );

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
