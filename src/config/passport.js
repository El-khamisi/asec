const passport = require('passport');
const User = require('../services/user/user.model');
const { setS_id } = require('../utils/cookie');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = require('./env');

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      profile = {
        google_id: profile.id,
        first_name: profile.given_name,
        last_name: profile.family_name,
        photo: profile.picture,
        email: profile.email,
      }
      let user  = await User.findOne({ email: profile.email });
      if(!user) {
        user = new User({
          ...profile,
          password: 'google',
        })
        await user.save();
      }
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
