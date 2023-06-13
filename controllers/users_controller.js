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

module.exports.getReset = function (req, res) {
  if (req.isAuthenticated()) {
    return res.render("reset", {
      title: "Auth App || Reset Password",
    });
  }

  return res.redirect("/users/sign-in");
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

//forgot password action
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
    const link = `https://nodejs-authentication-app-ikrj.onrender.com/users/reset-password/${user.id}/${token}`;
    console.log(link);

    //create email template
    let emailTemplate = {
      body: {
        name: user.name,
        intro:
          "You have received this email because a password reset request for your account was received.",
        action: {
          instructions:
            "Click the button below to reset your password and Note that below link only valid for 15 minutes",
          button: {
            color: "#DC4D2F",
            text: "Reset your password",
            link: link,
          },
        },
        outro:
          "If you did not request a password reset, no further action is required on your part",
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
        // console.log("INFO--->", info);
        return res.redirect("back");
      }
    });
  } catch (err) {
    console.log(err);
    return;
  }
};

//get reset password page
module.exports.getResetPasswordPage = async function (req, res) {
  const { userId, token } = req.params;

  //check if this id exist in database
  const user = await User.findOne({ _id: userId });

  //if user not found
  if (!user) {
    // Send JSON response with appropriate error message
    return res.status(404).json({ error: "User not found" });
  }

  //if user is valid
  const secret = process.env.JWT_SECRET + user.password;

  try {
    //verify token
    const decoded = jwt.verify(token, secret);

    // Render reset password page
    return res.render("reset_password", {
      title: "Auth app | Reset Password",
      email: user.email,
    });
  } catch (err) {
    //if verify is not successfull then render message
    console.log(err.message);
    return res.send(err.message);
  }
};

//reset password
module.exports.resetPassword = async function (req, res) {
  const { userId, token } = req.params;

  //extract password and confirm password from req.body
  const { password, confirm_password } = req.body;

  //check if this id exist in database
  const user = await User.findOne({ _id: userId });

  //if user not found
  if (!user) {
    // Send JSON response with appropriate error message
    return res.status(404).json({ error: "User not found" });
  }

  //if user is valid
  const secret = process.env.JWT_SECRET + user.password;

  try {
    //verify token
    const decoded = jwt.verify(token, secret);

    // Password validation
    if (password !== confirm_password) {
      req.flash("error", "Passwords do not match");
      return res.redirect("back");
    }

    //if password and confirm pasword matches then hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //update password in database
    let updateduser = await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
      },
      {
        new: true,
      }
    );

    if (!updateduser) {
      req.flash("error", "Error updating password");
      return res.redirect("back");
    }

    //req.flash
    req.flash("success", "Password reset successfully, Kindly login now");
    return res.redirect("/users/sign-in");
  } catch (err) {
    //if verify is not successfull then render message
    console.log(err.message);
    return res.send(err.message);
  }
};

//reset old password for user
module.exports.resetCurrentPass = async (req, res) => {
  try {
    //get current_password,new_password, confirm_new_password
    const { userId } = req.params;
    const { current_password, new_password, confirm_new_password } = req.body;

    if (new_password !== confirm_new_password) {
      req.flash("error", "New password and confirm password does not match");
      return res.redirect("back");
    }

    //check userId is exist in database or not
    const user = await User.findById(userId);

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("users/sign-in");
    }

    //user found check if current_password is matches with user password
    const isMatch = await bcrypt.compare(current_password, user.password);

    if (isMatch) {
      //hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);
      //update user password
      await User.findByIdAndUpdate(
        userId,
        {
          password: hashedPassword,
        },
        {
          new: true,
        }
      );

      // Clear the existing user session if any
      req.session.destroy();
      return res.redirect("/users/sign-in");
    }
    req.flash("error", "Your current password is incorrect!!");
    return res.redirect("back");
  } catch (err) {
    console.log(err.message);
    req.flash("error", "Error in resetting password!!");
    return res.redirect("back");
  }
};
