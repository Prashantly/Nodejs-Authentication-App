module.exports.signUp = function (req, res) {
  return res.render("user_sign_up", {
    title: "Auth app | Sign Up",
  });
};

module.exports.signIn = function (req, res) {
  return res.render("user_sign_in", {
    title: "Auth app | Sign In",
  });
};

//get the the sign up data
module.exports.create = async (req, res) => {};

// sign-in and create session for the user
module.exports.createSession = function (req, res) {};
