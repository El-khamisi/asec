const Review = require('./review.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.addReview = async (req, res) => {
  try {
    const { first_name, last_name, photo } = req.session.user;

    const { type, id } = req.params;
    const { rating, text } = req.body;
    let review = new Review({
      content_id: id,
      content_type: type,
      user_name: `${first_name} ${last_name}`,
      user_thumb: photo,
      rating,
      text,
    });

    await review.save();
    review = {
      user_name: review.user_name,
      user_thumb: review.user_thumb,
      rating: review.rating,
      text: review.text,
    };
    return successfulRes(res, 200, review);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
