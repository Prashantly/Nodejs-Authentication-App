const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      try {
        //find user and establish the identity
        const user = await User.findOne({ email: email });

        if (!user) {
          //user not found
          // req.flash("error", "Invalid Username or Password");
          console.log("Invalid username or password");
          return done(null, false);
        }

        //compare passwords using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          //password not match
          // req.flash("error", "Invalid Username or Password");
          console.log("Invalid username or password");
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        console.log("Error in finding user --> passport");
        return done(err);
      }
    }
  )
);

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  //passport encrypts the userId data and put it into cookie
  done(null, user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
  try {
    //find user by id
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    console.log("Error in finding user ----> passport");
    return done(err);
  }
});

module.exports = passport;
