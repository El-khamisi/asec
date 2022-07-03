const router = require('express').Router();
const { logUser, regUser, logout, resetPassword } = require('./login.controller');
const { authN } = require('../../middlewares/authN');
const { emailVerification } = require('./email-verification.controller');

router.get('/login', logUser);
router.post('/signup', regUser);
router.post('/logout', logout);
router.put('/reset-password', authN, resetPassword);
router.get('/email-verification/:hash', emailVerification);

//Login-with google
router.get('/login/google');

router.get('/google/cb');

module.exports = router;
