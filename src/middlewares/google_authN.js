const router = require('express').Router();
const passport = require('passport');

require('../config/passport');
router.get('/google', (req, res)=>{
    res.render('login');

})
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/back', 
passport.authenticate('google', { 
    failureRedirect: '/faild',
    successRedirect: '/success' }));

router.get('/faild', function (req, res) {
  res.json('faild');
});

router.get('/success', function (req, res) {
    console.log(req.user);
    res.json('success');
  });
module.exports = router;
