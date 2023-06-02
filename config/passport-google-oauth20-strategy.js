const User = require("../models/user");
const passport = require("passport");
let GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");
const GOOGLE_CLIENT_ID =
  "512969332980-d667iiq64s2klca4qnq6ffbrljgi9r3j.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

//tell passport to use new strategy for google login
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      //find user
      User.findOne({
        email: profile.emails[0].value.exec(function (err, user) {
          if (err) {
            console.log("Error in google strategy-passport", err);
            return;
          }

          console.log(profile);

          if (user) {
            //if found, set this use as req.user
            return done(null, user);
          } else {
            //if not found, create user and set it as req.user
            User.create(
              {
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString("hex"),
              },
              function (err, user) {
                if (err) {
                  console.log(
                    "Error in creating user google strategy-passport",
                    err
                  );
                  return;
                }
                return done(null, user);
              }
            );
          }
        }),
      });
    }
  )
);

module.export = passport;
