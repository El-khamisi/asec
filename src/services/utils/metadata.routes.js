const router = require('express').Router();
const { levels, membership, subscriptions, categories } = require('../../config/public_config');

router.get('/metadata', (req, res) => {
  successfulRes(res, 200, { levels, membership, subscriptions, categories });
});

module.exports = router;
