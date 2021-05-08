const express = require("express");
const router = express.Router();
const session = require("express-session");

const passport = require("../passport");

const flash = require("express-flash");

router.use(passport.initialize());

router.use(passport.session());

router.use(flash());

router.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  next();
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/login/github", passport.authenticate("github"));

router.get(
  "/login/github/callback",
  passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/login/facebook", passport.authenticate("facebook"));

router.get(
  "/login/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/login/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

module.exports = router;
