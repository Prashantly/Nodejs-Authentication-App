const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { transporter, mailGenerator } = require("../config/nodemailer");

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
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // create the email template
    const emailTemplate = {
      body: {
        name: newUser.name,
        intro:
          "Welcome to Authentication app! We're very excited to have you on board.",
        outro: "If you have any questions, feel free to reach out to us.",
      },
    };

    // Generate the email template
    const emailHTML = mailGenerator.generate(emailTemplate);

    // Generate the email options
    const emailOptions = {
      from: process.env.EMAIL,
      to: newUser.email,
      subject: "Welcome to Authentication app!",
      html: emailHTML,
    };

    // Send the email
    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
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

//forget password function
module.exports.forgetPassword = async function (req, res) {
  try {
    const { email } = req.body;
    // console.log(email);

    //check whether email exist or not
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "No account with that email address exists.");
      return res.redirect("/users/sign-in");
    }
    //if user exists
    // create secret
    const secret = process.env.JWT_SECRET + user.password;
    const payload = {
      email: user.email,
      id: user.id,
    };

    //create token
    const token = jwt.sign(payload, secret, {
      expiresIn: "15m",
    });

    // generate link from the token
    const link = `http://localhost:8000/users/reset-password/${user.id}/${token}`;
    // console.log(link);

    //create email template
    let emailTemplate = {
      body: {
        name: user.name,
        intro:
          "You have received this email because a password reset request for your account was received.",
        action: {
          instructions: "Click the button below to reset your password",
          button: {
            color: "#DC4D2F",
            text: "Reset your password",
            link: link,
          },
        },
        outro:
          "If you did not request a password reset, no further action is required on your part.",
      },
    };

    const emailBody = mailGenerator.generate(emailTemplate);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    const emailText = mailGenerator.generatePlaintext(emailTemplate);

    // Generate the email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password reset",
      html: emailBody,
      text: emailText,
    };

    //send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        //add req.flash
        req.flash("error", "Error sending email");
        return;
      } else {
        //add req.flash
        req.flash("success", "An e-mail has been sent to " + user.email);
        console.log("INFO--->", info);
        return res.redirect("back");
      }
    });
  } catch (err) {
    console.log(err);
    return;
  }
};
