const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users_controller");
const passport = require("passport");

router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);

router.post("/create", usersController.create);
//use passport as middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", {
    failureRedirect: "/users/sign-in",
  }),
  usersController.createSession
);

router.get("/log-out", usersController.destroySession);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

router.post("/forget-password", usersController.forgetPassword);

module.exports = router;
