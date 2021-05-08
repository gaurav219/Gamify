const express = require("express");
const router = express.Router();

const { User } = require("../models/User");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  const newuser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  if (newuser.username == "") {
    req.flash("error", "Please Enter Username!!");
    res.redirect("/signup");
    return;
  }
  if (newuser.email == "") {
    req.flash("error", "Please Enter Valid Email!!");
    res.redirect("/signup");
    return;
  }
  if (newuser.password == "") {
    req.flash("error", "Please Enter Password!!");
    res.redirect("/signup");
    return;
  }
  User.query()
    .insert(newuser)
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));

  // Users.create(newuser).then((el) => {});
});

module.exports = router;
