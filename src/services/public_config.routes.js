const { successfulRes } = require('../utils/response');

const router = require('express').Router();

router.get('/public/subscriptions', (req, res) => {
  return successfulRes(
    res,
    200,
    subscriptions.map((e) => e.type)
  );
});

module.exports = router;
