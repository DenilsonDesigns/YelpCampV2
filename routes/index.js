const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

//Display landing page
router.get("/", (req, res) => {
  res.render("landing");
});

//AUTH ROUTES

//SHOW REGISTER FORM
router.get("/register", (req, res) => {
  res.render("register", { page: "register" });
});

//SIGN UP LOGIC
router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      return res.render("register", { error: err.message });
    } else {
      passport.authenticate("local")(req, res, () => {
        req.flash("success", "Welcome to YelpCamp " + user.username);
        res.redirect("/campgrounds");
      });
    }
  });
});

//SHOW login form
router.get("/login", (req, res) => {
  res.render("login", { page: "login" });
});

//handling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

//LOGOUT ROUTE
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect("/campgrounds");
});

module.exports = router;
