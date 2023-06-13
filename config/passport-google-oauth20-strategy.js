const User = require("../models/user");
const passport = require("passport");
let GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");
const GOOGLE_CLIENT_ID = process.env.CONFIGURE_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CONFIGURE_GOOGLE_CLIENT_SECRET;

// Tell passport to use new strategy for Google login
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // Find user
        const user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          return done(null, user);
        } else {
          // If user is not found, create the user and set it as req.user
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
          });
          return done(null, newUser);
        }
      } catch (err) {
        console.log("Error in Google strategy-passport", err);
        return done(err);
      }
    }
  )
);

module.export = passport;
