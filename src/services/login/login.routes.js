const router = require('express').Router();
const passport = require('passport');
const { logUser, regUser, logout, resetPassword } = require('./login.controller');
const { authN } = require('../../middlewares/authN');
const { emailVerification } = require('./email-verification.controller');

require('../../config/passport');


router.get('/login', logUser);
router.post('/signup', regUser);
router.post('/logout', logout);
router.put('/reset-password', authN, resetPassword);
router.get('/email-verification/:hash', emailVerification);


//Login-with google
router.get('/login/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/cb', passport.authenticate('google', { failureRedirect: '/google/faild', successRedirect: '/google/success' }));

router.get('/google/faild', function (req, res) {
  res.json('faild');
});

router.get('/google/success', function (req, res) {
    console.log('req.user', req.user);
    console.log('req.session.user', req.session.user);
    console.log('req.cookie', req.cookies);
  res.json('success');
});

module.exports = router;
