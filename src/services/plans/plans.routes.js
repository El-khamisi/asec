const router = require('express').Router();

const { authN } = require('../../middlewares/authN');
const { isAdmin } = require('../../middlewares/authZ');
const { getPlans, editPlans } = require('./plans.controller');

router.get('/plans', getPlans);
router.put('/plans', authN, isAdmin, editPlans);

module.exports = router;
