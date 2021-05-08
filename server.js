const express = require("express");
const session = require("express-session");
const passport = require("./passport");
// const flash = require("express-flash");
// const cookieParser = require("cookie-parser");
// const Auth = require("connect-ensure-login");
const path = require("path");
// const SQLiteStore = require("connect-sqlite3")(session);
const port = process.env.PORT || 7890;

const Knex = require("knex");

const knexfile = require("./knexfile");

const knex = Knex(knexfile.production);

const { Model } = require("objection");

Model.knex(knex);

// const { User } = require("./models/User");
const { AllGames } = require("./models/AllGames");

require("dotenv").config();
// let { db, Users, Games, Sequelize } = require("./db");

// let userone = {};

//let flag = 1;

const app = express();

app.set("view engine", "hbs");

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// app.use(cookieParser("secret"));

app.use(
  session({
    // store: new SQLiteStore(),
    secret: "averylongstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  })
);

// app.use((req, res, next) => {
//   res.locals.login = req.isAuthenticated();
//   next();
// });
app.use("/", require("./routes/Login"));
app.use("/", require("./routes/Admin"));
app.use("/", require("./routes/About"));
app.use("/", require("./routes/Show"));
app.use("/", require("./routes/SignUp"));
app.use("/", require("./routes/Game"));
app.use("/", require("./routes/UserGames"));

// app.use(flash());

app.get("/", (req, res) => {
  AllGames.query()
    .select("Title")
    .orderBy("Likes", "desc")
    // ;.then((s) => {
    //   console.log(s);
    // })
    // Games.query()
    //   .select(raw('count("ID")'), "Title")
    //   .groupBy("Title")
    //   .orderBy("count", "desc")
    .then((games) => {
      if (req.user) {
        // console.log(req.user.ID);
        //console.log('inside if');
        let game1 = [];
        games.forEach((game) => {
          game1.push(game.Title);
        });
        if (req.user.username != undefined) {
          res.render("index", {
            user: req.user.username,
            game1,
          });
        } else {
          res.render("index", {
            user: req.user.displayName,
            game1,
          });
        }
      } else {
        let game1 = [];
        games.forEach((game) => {
          game1.push(game.Title);
        });
        //console.log(game1);
        res.render("index", { game1 });
      }
    })
    .catch((err) => console.log(err));
});

// app.get("/logout", function (req, res) {
//   req.session.destroy(function (err) {
//     res.redirect("/");
//   });
// });

app.get("/support", (req, res) => res.render("support"));

app.use(express.static(path.join(__dirname, "/public")));

app.use(express.static(path.join(__dirname, "/public/images")));

// app.use("/admin", express.static(__dirname + "/public"));

app.listen(port, () => {
  console.log("listening to port");
});

////// END END END END END END END END END END END END END END END END  /////////

// app.use(passport.initialize());

// app.use(passport.session());

// app.use((req, res, next) => {
//   res.locals.login = req.isAuthenticated();
//   next();
// });

// app.get("/", (req, res) => {
//   AllGames.query()
//     .select("Title")
//     .orderBy("Likes", "desc")
//     // ;.then((s) => {
//     //   console.log(s);
//     // })
//     // Games.query()
//     //   .select(raw('count("ID")'), "Title")
//     //   .groupBy("Title")
//     //   .orderBy("count", "desc")
//     .then((games) => {
//       if (req.user) {
//         // console.log(req.user.ID);
//         //console.log('inside if');
//         let game1 = [];
//         games.forEach((game) => {
//           game1.push(game.Title);
//         });
//         if (req.user.username != undefined) {
//           res.render("index", {
//             user: req.user.username,
//             game1,
//           });
//         } else {
//           res.render("index", {
//             user: req.user.displayName,
//             game1,
//           });
//         }
//       } else {
//         let game1 = [];
//         games.forEach((game) => {
//           game1.push(game.Title);
//         });
//         //console.log(game1);
//         res.render("index", { game1 });
//       }
//     })
//     .catch((err) => console.log(err));
// });

// app.get("/signup", (req, res) => {
//   res.render("signup");
// });

// app.get("/login", (req, res) => {
//   res.render("login");
// });

// const isAdmin = (req, res, next) => {
//   if (req.user.username == "test") {
//     userone.Name = "test";
//     return next();
//   } else {
//     req.flash("info", "Access Denied!!!");
//     res.redirect("/");
//     return;
//   }
// };

// app.get("/admin", Auth.ensureLoggedIn("/login"), isAdmin, (req, res) => {
//   res.render("admin", {
//     user: req.user,
//   });
// });

// app.get("/show", Auth.ensureLoggedIn("/login"), (req, res) => {
//   AllGames.query()
//     .select("Title", "Genre", "Image", "URL")
//     //Games.query()
//     //.distinct("ID", "Title", "Genre", "Image", "URL")
//     .then((games) => {
//       const ga = games;
//       res.render("show", {
//         ga,
//       });
//     });

//   // Games.findAll().then((el) => {});
// });

// app.get("/about", (req, res) => {
//   res.render("about");
// });

// app.get("/game", (req, res) => {
//   let ans = req.query.game;
//   if (ans == undefined) {
//     req.flash("error", "Please Enter Title of Game!!!");
//     res.redirect("/");
//     return;
//   }
//   res.redirect("/game/" + ans);
// });

// app.get("/game/:Name", (req, res) => {
//   let flag = 1;

//   const ans = req.params.Name;

//   //console.log(ans, "ANS");

//   let fgame;

//   const id = 0;

//   if (req.user) {
//     id = req.user.id;
//   }

//   let small = 0;

//   User.query()
//     .findById(id)
//     .then((s) => {
//       s.$relatedQuery("games")
//         .select("*")
//         .then((s) => {
//           s.every((game) => {
//             if (game.Title === ans) {
//               console.log(game.Title, "TITLE");
//               fgame = game;
//               flag = 0;
//               return false;
//             }
//             return true;
//           });

//           //console.log("AFTER HERE");

//           console.log(fgame, "GAME");
//           res.render("game", { fgame, flag });
//           small = 1;

//           // Games.query()
//           //   .where("Title", ans)
//           //   .then((games) => {
//           //     if (games.length > 0) {
//           //       game = games[0];
//           //
//           //     }
//           //   });

//           if (small == 0) {
//             Games.query()
//               .distinct("ID", "Title", "Genre", "Image", "URL")

//               .where(raw('lower("Title")'), "like", "%" + ans + "%")

//               .then((game) => {
//                 if (game.length == 0) {
//                   req.flash("error", "Sorry, Game not found!!!");
//                   res.redirect("/");
//                   return;
//                 }
//                 game = game[0];
//                 console.log(game, "GAME");
//                 res.render("game", { game, flag });
//               })
//               .catch((err) => console.log(err, "getting game"));
//           }
//         })
//         .catch((err) => console.log(err, "getting all games"));
//     })
//     .catch((err) => console.log(err, "findByID - Not found"));

//   // Games.findOne({
//   //   where: {
//   //     Name: Sequelize.where(
//   //       Sequelize.fn('LOWER', Sequelize.col('Name')),
//   //       'LIKE',
//   //       '%' + ans + '%'
//   //     ),
//   //   },
//   // })
// });

// app.get("/game/:Name", (req, res) => {
//   let temp = {};

//   let flag = 1;

//   //Games.query()
//   AllGames.query()
//     .select("*")
//     .where("Title", req.params.Name)
//     .then((game) => {
//       if (game.length === 0) {
//         //Games.query()
//         // AllGames.select("*")

//         AllGames.query()
//           .select("*")
//           // .where(raw('LOWER("Title")'), "like", "%" + "gta" + "%")
//           .where(raw('lower("Title")'), "like", "%" + req.params.Name + "%")

//           //.distinct("ID", "Title", "Genre", "Image", "URL")
//           //.where('lower("Title")'), "like", "%" + req.params.Name + "%")
//           .then((curr) => {
//             console.log(curr, "CURR");
//             if (curr.length == 0) {
//               //console.log("HERE");
//               req.flash("error", "Sorry, Game not found!!!");
//               res.redirect("/");
//               return;
//             }

//             temp = curr[0];
//             res.render("game", { temp, flag });
//           });
//       } else {
//         if (req.user) {
//           User.query()
//             .findById(req.user.ID)
//             .then((s) => {
//               s.$relatedQuery("games")
//                 .select("*")
//                 .then((s) => {
//                   s.every((game) => {
//                     if (game.Title === req.params.Name) {
//                       flag = 0;
//                       return false;
//                     }
//                     return true;
//                   });
//                   temp = game[0];
//                   res.render("game", { temp, flag });
//                   return;
//                 });
//             });
//         } else {
//           temp = game[0];
//           res.render("game", { temp, flag });
//         }
//       }
//     })
//     .catch((e) => {
//       console.log(e, "fetch error game");
//     });
// });

// app.get("/logout", function (req, res) {
//   req.session.destroy(function (err) {
//     res.redirect("/");
//   });
// });

// app.get("/login/github", passport.authenticate("github"));

// app.get(
//   "/login/github/callback",
//   passport.authenticate("github", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   })
// );

// app.get("/login/facebook", passport.authenticate("facebook"));

// app.get(
//   "/login/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

// app.get(
//   "/login/google",
//   passport.authenticate("google", { scope: ["profile"] })
// );

// app.get(
//   "/login/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

// app.get("/support", (req, res) => res.render("support"));

// app.get("/admin/del", Auth.ensureLoggedIn("/login"), isAdmin, (req, res) => {
//   res.render("admindelete", {
//     user: req.user,
//   });
// });
/////* GET Ends Here */////

// app.post(
//   "/login",
//   passport.authenticate("local", {
//     successReturnToOrRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

// app.post("/signup", (req, res) => {
//   const newuser = {
//     username: req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//   };
//   if (newuser.username == "") {
//     req.flash("error", "Please Enter Username!!");
//     res.redirect("/signup");
//     return;
//   }
//   if (newuser.email == "") {
//     req.flash("error", "Please Enter Valid Email!!");
//     res.redirect("/signup");
//     return;
//   }
//   if (newuser.password == "") {
//     req.flash("error", "Please Enter Password!!");
//     res.redirect("/signup");
//     return;
//   }
//   User.query()
//     .insert(newuser)
//     .then(() => {
//       res.redirect("/login");
//     })
//     .catch((err) => console.log(err));

//   // Users.create(newuser).then((el) => {});
// });

// app.get("/game/:Name/:flag", Auth.ensureLoggedIn("/login"), (req, res) => {
//   const ans = req.params.Name;

//   const id = req.user.ID;

//   const flag = req.params.flag;
//   //console.log("GOTCHA");
//   User.query()
//     .findById(id)
//     .then((s) => {
//       AllGames.query()
//         .where("Title", ans)
//         .then((game) => {
//           game = game[0];
//           if (flag == 1) {
//             let sm = game;
//             delete sm.Likes;
//             s.$relatedQuery("games")
//               .insert(sm)
//               .then((result) => {
//                 AllGames.query()
//                   .select("Likes")
//                   .where("Title", game.Title)
//                   .then((likes) => {
//                     console.log(likes, "LIKES");
//                     likes = likes[0];
//                     likes.Likes += 1;
//                     AllGames.query()
//                       .patchAndFetchById(game.ID, { Likes: likes.Likes })
//                       // .patch({ Likes: likes.Likes })
//                       //.where("Title", game.Title)
//                       .then((ans) => {
//                         console.log(
//                           `${ans.Title} added to ${req.user.username} and likes are set to ${likes.Likes}`
//                         );
//                         res.render("game", { temp: ans, flag: 0 });
//                       })
//                       .catch((err) => console.log(err, "++ Likes"));
//                   })
//                   .catch((err) => console.log(err, "getting game"));
//               })
//               .catch((err) => console.log(err, "getting related games"));
//           } else {
//             s.$relatedQuery("games")
//               .delete()
//               .where("Title", game.Title)
//               .then((result) => {
//                 AllGames.query()
//                   .select("Likes")
//                   .where("Title", game.Title)
//                   .then((likes) => {
//                     // console.log(likes, "LIKES");
//                     likes = likes[0];
//                     likes.Likes -= 1;
//                     AllGames.query()
//                       .patchAndFetchById(game.ID, { Likes: likes.Likes })
//                       //.patch({ Likes: likes.Likes })
//                       //.where("Title", game.Title)
//                       .then((ans) => {
//                         console.log(ans, "ANS");
//                         console.log(
//                           `${ans.Title} removed from ${req.user.username} and likes are set to ${likes.Likes}`
//                         );
//                         res.render("game", { temp: ans, flag: 1 });
//                       })
//                       .catch((err) => console.log(err, "-- Likes"));
//                   })
//                   .catch((err) => console.log(err, "getting game --"));
//                 // console.log(`${ans} removed from ${req.user.username}`);
//                 // res.render("game", { temp: game, flag: 1 });
//               })
//               .catch((err) => console.log(err, "deleting from relation"));
//           }
//         });
//     });

//   // if (flag == 1) {
//   //   flag = 0;
//   //   Games.findOne({
//   //     where: {
//   //       Name: ans,
//   //     },
//   //   }).then((game) => {
//   //     let inc = game.Likes;
//   //     inc++;
//   //     Games.update({ Likes: inc }, { where: { Name: game.Name } })
//   //       .then(
//   //         (result) => res.redirect("/game/" + game.Name),

//   //         console.log("done successfully!!")
//   //       )
//   //       .catch((err) => console.log(err));
//   //   });
//   // } else {
//   //   flag = 1;
//   //   console.log(ans.id);
//   //   Games.findOne({
//   //     where: {
//   //       Name: ans,
//   //     },
//   //   }).then((game) => {
//   //     let dec = game.Likes;
//   //     dec--;
//   //     Games.update({ Likes: dec }, { where: { Name: game.Name } })
//   //       .then((result) => res.redirect("/game/" + game.Name))
//   //       .catch((err) => console.log(err));
//   //   });
//   // }
// });

// app.post("/admin", (req, res, next) => {
//   const newgame = {
//     id: req.body.id,
//     Name: req.body.title,
//     Genre: req.body.genre,
//     Image: req.body.image,
//     URL: req.body.url,
//   };

//   if (
//     newgame.id == "" ||
//     newgame.Name == "" ||
//     newgame.Genre == "" ||
//     newgame.Image == "" ||
//     newgame.URL == ""
//   ) {
//     req.flash("error", "Please fill all the Details!!!");
//     res.redirect("/admin");
//     return;
//   }
//   Games.query()
//     .insert(newgame)
//     // Games.create(newgame)
//     .then((el) => {
//       req.flash("successMessage", "Game was added successfully!!!");
//       res.redirect("/admin");
//     })
//     .catch((err) => console.log(err));
// });

// app.post("/admin/del", (req, res) => {
//   Games.query()
//     .delete()
//     .where("ID", req.body.id)
//     .then((game) => {
//       if (!game) {
//         req.flash("error", "Game not Found!!!");
//         res.redirect("/admin/del");
//         return;
//       }
//       console.log("deleted");
//       res.redirect("/");
//     })
//     .catch((err) => console.log(err));
// });

/// POST Ends Here!!!!

// app.use(express.static(path.join(__dirname, "/public")));

// app.use(express.static(path.join(__dirname, "/public/images")));

// app.use("/admin", express.static(__dirname + "/public"));

// app.listen(port, () => {
//   console.log("listening to port");
// });
