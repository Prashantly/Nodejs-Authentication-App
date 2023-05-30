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
