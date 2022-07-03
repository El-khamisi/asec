const router = require('express').Router();
const { levels, memberships, subscriptions, categories } = require('../../config/public_config');

router.get('/metadata', (req, res) => {
  successfulRes(res, 200, { levels, memberships, subscriptions, categories });
});

module.exports = router;
