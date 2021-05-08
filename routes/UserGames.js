const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");
// const session = require("express-session");

const { AllGames } = require("../models/AllGames");
const { User } = require("../models/User");

router.get("/mygames", ensureLoggedIn("/login"), (req, res) => {
  const UserGames = async () => {
    let flag = 0;
    const games = await User.relatedQuery("games").for(req.user.ID);

    if (games.length === 0) {
      flag = 1;
    }
    //res.render("usergames", { ga: [] });
    res.render("usergames", { ga: games, flag });
  };

  UserGames();
});

module.exports = router;
