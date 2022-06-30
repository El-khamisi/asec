const router = require('express').Router();
const { authN } = require('../../middlewares/authN');
const { addReview } = require('./review.controller');

router.post('/reviews/:type/:id', authN, addReview);

module.exports = router;
