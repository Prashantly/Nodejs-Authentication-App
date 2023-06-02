const User = require("../models/user");
const passport = require("passport");
let GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");
const GOOGLE_CLIENT_ID =
  "512969332980-d667iiq64s2klca4qnq6ffbrljgi9r3j.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

// Tell passport to use new strategy for Google login
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // Find user
        const user = await User.findOne({ email: profile.emails[0].value });

        // console.log(accessToken, refreshToken);
        // console.log(profile);

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
