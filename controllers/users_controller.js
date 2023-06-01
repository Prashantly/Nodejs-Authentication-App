const User = require("../models/user");
const bcrypt = require("bcrypt");

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("user_sign_up", {
    title: "Auth app | Sign Up",
  });
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("user_sign_in", {
    title: "Auth app | Sign In",
  });
};

//get the the sign up data
module.exports.create = async (req, res) => {
  try {
    const { name, email, password, confirm_password } = req.body;

    // Password validation
    if (password !== confirm_password) {
      req.flash("error", "Passwords do not match");
      return res.redirect("back");
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash("error", "Email already registered!");
      return res.redirect("back");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user
    // create a new user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Success message and redirect
    req.flash("success", "Account created!");
    return res.redirect("/users/sign-in");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

// sign-in and create session for the user
module.exports.createSession = function (req, res) {
  //success flash message
  req.flash("success", "You are now logged in!");
  return res.redirect("/");
};

// destroy session or sign out or clears the cookie
module.exports.destroySession = function (req, res) {
  req.logout((err) => {
    // Clear the authenticated user's session data
    if (err) {
      return next(err);
    }
    req.flash("success", "You are now signed out");
    return res.redirect("/");
  });
};
