const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GithubStrategy = require('passport-github').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy

const {
    Users
} = require('./db')

passport.use('local',
    new LocalStrategy((username, password, done) => {
        Users.findOne({
            where: {
                username,
            },
        })
            .then((user) => {
                if (!user) {
                    return done(null, false, {
                        message: 'Username is not valid'
                    })
                }

                if (user.password != password) {
                    return done(null, false, {
                        message: 'Password is INCORRECT!!!'
                    })
                }
                done(null, user)
            })
            .catch(done)
    }),
)

passport.use(new GithubStrategy({
    clientID: 'Iv1.a7dc6f7f95100c4d',
    clientSecret: '1a1dec9a0d5c63327eb6ebfc0be24372ae2932a2',
    callbackURL: 'http://localhost:7890/login/github/callback',
},
    (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        Users.findCreateFind({
            where: {
                username: profile.id
            },
            defaults: {
                username: profile.id,
                ghAccessToken: accessToken,
            },
        }).then((user) => {
            //console.log('after this')
            //console.log(profile.displayName)
            done(null, profile)
        })
            .catch(done)
        /* console.log(profile)
        Users.create({
                username: profile.id,
                ghAccessToken: accessToken,
            }) */

    },
))

passport.use(new FacebookStrategy({
    clientID: '894130110965374',
    clientSecret: '2a826c57a5b48b104af9eeb00a60667f',
    callbackURL: "http://localhost:7890/login/facebook/callback"
},
    (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        Users.findCreateFind({
            where: {
                username: profile.id
            },
            defaults: {
                username: profile.id,
                fbAcessToken: accessToken,
            }
        }).then((user) => {
            console.log('successful authentication via fb')
            done(null, profile)
        })
            .catch(done)
    }
));


passport.use(new GoogleStrategy({
    clientID: '960091983754-jdg7m286hslrek15bqio3cd0dg6osf47.apps.googleusercontent.com',
    clientSecret: 'lcahPdCCbzTOJuRlFSCGGIFn',
    callbackURL: "http://localhost:7890/login/google/callback"
},
    (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        Users.findCreateFind({
            where: {
                username: profile.id
            },
            defaults: {
                username: profile.id,
                gleAcessToken: accessToken,
            }
        }).then((user) => {
            console.log('successful authentication via google')
            done(null, profile)
        })
            .catch(done)
    }
));



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

module.exports = passport