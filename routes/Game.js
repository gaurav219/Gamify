const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");
// const session = require("express-session");

const { AllGames } = require("../models/AllGames");
const { User } = require("../models/User");
const { raw } = require("objection");

router.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  next();
});

router.get("/game", (req, res) => {
  let ans = req.query.game;
  if (ans == undefined) {
    req.flash("error", "Please Enter Title of Game!!!");
    res.redirect("/");
    return;
  }
  res.redirect("/game/" + ans);
});

router.get("/game/:Name", (req, res) => {
  let temp = {};

  let flag = 1;

  //Games.query()
  AllGames.query()
    .select("*")
    .where("Title", req.params.Name)
    .then((game) => {
      if (game.length === 0) {
        //Games.query()
        // AllGames.select("*")

        AllGames.query()
          .select("*")
          // .where(raw('LOWER("Title")'), "like", "%" + "gta" + "%")
          .where(raw('lower("Title")'), "like", "%" + req.params.Name + "%")

          //.distinct("ID", "Title", "Genre", "Image", "URL")
          //.where('lower("Title")'), "like", "%" + req.params.Name + "%")
          .then((curr) => {
            console.log(curr, "CURR");
            if (curr.length == 0) {
              //console.log("HERE");
              req.flash("error", "Sorry, Game not found!!!");
              res.redirect("/");
              return;
            }

            temp = curr[0];
            res.render("game", { temp, flag });
          });
      } else {
        if (req.user) {
          User.query()
            .findById(req.user.ID)
            .then((s) => {
              s.$relatedQuery("games")
                .select("*")
                .then((s) => {
                  s.every((game) => {
                    if (game.Title === req.params.Name) {
                      flag = 0;
                      return false;
                    }
                    return true;
                  });
                  temp = game[0];
                  res.render("game", { temp, flag });
                  return;
                });
            });
        } else {
          temp = game[0];
          res.render("game", { temp, flag });
        }
      }
    })
    .catch((e) => {
      console.log(e, "fetch error game");
    });
});

router.get("/game/:Name/:flag", ensureLoggedIn("/login"), (req, res) => {
  const ans = req.params.Name;

  const id = req.user.ID;

  const flag = req.params.flag;
  //console.log("GOTCHA");
  User.query()
    .findById(id)
    .then((s) => {
      AllGames.query()
        .where("Title", ans)
        .then((game) => {
          game = game[0];
          if (flag == 1) {
            let sm = game;
            delete sm.Likes;
            s.$relatedQuery("games")
              .insert(sm)
              .then((result) => {
                AllGames.query()
                  .select("Likes")
                  .where("Title", game.Title)
                  .then((likes) => {
                    console.log(likes, "LIKES");
                    likes = likes[0];
                    likes.Likes += 1;
                    AllGames.query()
                      .patchAndFetchById(game.ID, { Likes: likes.Likes })
                      // .patch({ Likes: likes.Likes })
                      //.where("Title", game.Title)
                      .then((ans) => {
                        console.log(
                          `${ans.Title} added to ${req.user.username} and likes are set to ${likes.Likes}`
                        );
                        res.render("game", { temp: ans, flag: 0 });
                      })
                      .catch((err) => console.log(err, "++ Likes"));
                  })
                  .catch((err) => console.log(err, "getting game"));
              })
              .catch((err) => console.log(err, "getting related games"));
          } else {
            s.$relatedQuery("games")
              .delete()
              .where("Title", game.Title)
              .then((result) => {
                AllGames.query()
                  .select("Likes")
                  .where("Title", game.Title)
                  .then((likes) => {
                    // console.log(likes, "LIKES");
                    likes = likes[0];
                    likes.Likes -= 1;
                    AllGames.query()
                      .patchAndFetchById(game.ID, { Likes: likes.Likes })
                      //.patch({ Likes: likes.Likes })
                      //.where("Title", game.Title)
                      .then((ans) => {
                        console.log(ans, "ANS");
                        console.log(
                          `${ans.Title} removed from ${req.user.username} and likes are set to ${likes.Likes}`
                        );
                        res.render("game", { temp: ans, flag: 1 });
                      })
                      .catch((err) => console.log(err, "-- Likes"));
                  })
                  .catch((err) => console.log(err, "getting game --"));
                // console.log(`${ans} removed from ${req.user.username}`);
                // res.render("game", { temp: game, flag: 1 });
              })
              .catch((err) => console.log(err, "deleting from relation"));
          }
        });
    });
});

module.exports = router;
