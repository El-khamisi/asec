const router = require('express').Router();
const { verify } = require('../user/user.controllers');
const { authN } = require('../../middlewares/authN');

const admin = require('./admin.routes');
router.use('/dashboard', admin);
router.get('/verify', authN, verify);

module.exports = router;
