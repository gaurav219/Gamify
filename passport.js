const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const OutlookStrategy = require("passport-outlook").Strategy;
const flash = require("express-flash");
require("dotenv").config();

const router = require("express").Router();

const { User } = require("./models/User");

router.use(flash());

passport.use(
  "local",
  new LocalStrategy((username, password, done) => {
    User.query()
      .where("username", username)
      .then((user) => {
        if (!user[0]) {
          return done(null, false, {
            message: "Username is not valid",
          });
        }

        if (user[0].password != password) {
          return done(null, false, {
            message: "Password is INCORRECT!!!",
          });
        }
        done(null, user[0]);
      })
      .catch(done);
  })
);

passport.use(
  new GithubStrategy(
    {
      // clientID: "Iv1.a7dc6f7f95100c4d",
      clientID: process.env.GITHUB_ID,
      // clientSecret: "1a1dec9a0d5c63327eb6ebfc0be24372ae2932a2",
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: "https://gamify-v100.herokuapp.com/login/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      Users.findCreateFind({
        where: {
          username: profile.id,
        },
        defaults: {
          username: profile.id,
          ghAccessToken: accessToken,
        },
      })
        .then((user) => {
          //console.log('after this')
          //console.log(profile.displayName)
          done(null, profile);
        })
        .catch(done);
      /* console.log(profile)
        Users.create({
                username: profile.id,
                ghAccessToken: accessToken,
            }) */
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      //clientID: "894130110965374",
      clientID: process.env.FB_ID,
      //clientSecret: "2a826c57a5b48b104af9eeb00a60667f",
      clientSecret: process.env.FB_SECRET,
      //callbackURL: "http://localhost:7890/login/facebook/callback"
      callbackURL: "https://gamify-v100.herokuapp.com/login/facebook/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      Users.findCreateFind({
        where: {
          username: profile.id,
        },
        defaults: {
          username: profile.id,
          fbAcessToken: accessToken,
        },
      })
        .then((user) => {
          console.log("successful authentication via fb");
          done(null, profile);
        })
        .catch(done);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      //clientID:
      //    "960091983754-jdg7m286hslrek15bqio3cd0dg6osf47.apps.googleusercontent.com",
      clientID: process.env.Google_ID,
      clientSecret: process.env.Google_SECRET,
      //clientSecret: "lcahPdCCbzTOJuRlFSCGGIFn",
      callbackURL: "https://gamify-v100.herokuapp.com/login/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      Users.findCreateFind({
        where: {
          username: profile.id,
        },
        defaults: {
          username: profile.id,
          gleAcessToken: accessToken,
        },
      })
        .then((user) => {
          console.log("successful authentication via google");
          done(null, profile);
        })
        .catch(done);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
/* passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    Users.findOne({
            where: {
                id: userId,
            },
        })
        .then((user) => done(null, user))
        .catch(done)
}) */

module.exports = passport;
