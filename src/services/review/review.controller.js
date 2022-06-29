const Review = require("./review.model");
const { successfulRes, failedRes } = require("../../utils/response");

exports.addReview = async (req, res) => {
    try {
        const {type, id} = req.params;
        const { user_name, user_thumb, rating, text } = req.body;
        const review = await Review.create({
            content_id: id,
            content_type: type,
            user_name,
            user_thumb,
            rating,
            text
        });
        return successfulRes(res, 200, review);
    }catch (e) {
        return failedRes(res, 500, e);
    }
};
