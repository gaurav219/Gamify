const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");

const { AllGames } = require("../models/AllGames");

// router.use((req, res, next) => {
//   res.locals.login = req.isAuthenticated();
//   next();
// });

router.get("/show", ensureLoggedIn("/login"), (req, res) => {
  AllGames.query()
    .select("Title", "Genre", "Image", "URL")
    //Games.query()
    //.distinct("ID", "Title", "Genre", "Image", "URL")
    .then((games) => {
      const ga = games;
      res.render("show", {
        ga,
      });
    });
});

module.exports = router;
