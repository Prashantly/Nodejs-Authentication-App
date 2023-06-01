const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true, // Pass the req object to the callback function
    },
    async function (req, email, password, done) {
      try {
        //find user and establish the identity
        const user = await User.findOne({ email: email });

        if (!user) {
          //user not found
          req.flash("error", "Invalid Username or Password");
          console.log("Invalid username or password");
          return done(null, false);
        }

        //compare passwords using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          //password not match
          req.flash("error", "Invalid Username or Password");
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

// check user is auhenticated
passport.checkAuthentication = function (req, res, next) {
  //if user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  //if user is not signed in
  return res.redirect("/");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //req.user contains the current signed-in user from session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }

  next();
};
