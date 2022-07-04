const router = require('express').Router();
const { authN } = require('../../middlewares/authN');
const { isAdmin } = require('../../middlewares/authZ');
const { getSubscriptions, updateOrAddSubscription } = require('./subscription.controller');

router.get('/subscriptions', getSubscriptions);
router.put('/subscriptions', authN, isAdmin, updateOrAddSubscription);

module.exports = router;
