const express = require("express");
const router = express.Router();
const Auth = require("connect-ensure-login");

const { AllGames } = require("../models/AllGames");

require("dotenv").config();

const isAdmin = (req, res, next) => {
  if (req.user.username == process.env.ADMIN) {
    return next();
  } else {
    req.flash("info", "Access Denied!!!");
    res.redirect("/");
    return;
  }
};

router.get("/admin", Auth.ensureLoggedIn("/login"), isAdmin, (req, res) => {
  res.render("admin", {
    user: req.user,
  });
});

router.get("/admin/del", Auth.ensureLoggedIn("/login"), isAdmin, (req, res) => {
  res.render("admindelete", {
    user: req.user,
  });
});

router.post("/admin", (req, res, next) => {
  const newgame = {
    id: req.body.id,
    Name: req.body.title,
    Genre: req.body.genre,
    Image: req.body.image,
    URL: req.body.url,
  };

  if (
    newgame.id == "" ||
    newgame.Name == "" ||
    newgame.Genre == "" ||
    newgame.Image == "" ||
    newgame.URL == ""
  ) {
    req.flash("error", "Please fill all the Details!!!");
    res.redirect("/admin");
    return;
  }
  AllGames.query()
    .insert(newgame)
    // Games.create(newgame)
    .then((el) => {
      req.flash("successMessage", "Game was added successfully!!!");
      res.redirect("/admin");
    })
    .catch((err) => console.log(err));
});

router.post("/admin/del", (req, res) => {
  AllGames.query()
    .delete()
    .where("ID", req.body.ID)
    .then((game) => {
      if (!game) {
        req.flash("error", "Game not Found!!!");
        res.redirect("/admin/del");
        return;
      }
      console.log("deleted");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
