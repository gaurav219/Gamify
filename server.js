const express = require('express')
const session = require('express-session')
const passport = require('./passport')
const flash = require('express-flash')
const cookieParser = require('cookie-parser');
const Auth = require('connect-ensure-login')
const path = require('path')
const SQLiteStore = require('connect-sqlite3')(session);


let {
    db,
    Users,
    Games,
    Sequelize
} = require('./db')

let userone = {}

let flag = 1

const app = express()

app.set('view engine', 'hbs')

app.use(express.json())

app.use(express.urlencoded({
    extended: true
}))

app.use(cookieParser('secret'));

app.use(session({
    store: new SQLiteStore,
    secret: 'averylongstring',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
}))

app.use(flash())

app.use(passport.initialize())

app.use(passport.session())

app.use((req, res, next) => {
    res.locals.login = req.isAuthenticated();
    next();
})

app.get('/', (req, res) => {

    Games.findAll({
        order: [
            ['Likes', 'DESC']
        ],
    }).then((game) => {

        if (req.user) {
            console.log('inside if')
            const all = game
            if (req.user.username != undefined) {

                res.render('index', {
                    user: req.user.username, all
                })
            } else {
                res.render('index', {
                    user: req.user.displayName, all
                })
            }
        } else {
            const all = game
            res.render('index', { all })
        }
    }).catch((err) => console.log(err))
})


app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/login', (req, res) => {
    res.render('login')
    flag = 1
})

const isAdmin = (req, res, next, ) => {

    if (req.user.username == 'test') {
        userone.Name = 'test'
        return next()
    } else {
        req.flash('info', 'Access Denied!!!')
        res.redirect('/')
        return

    }
}

app.get('/admin', Auth.ensureLoggedIn('/login'), isAdmin, (req, res) => {
    res.render('admin', {
        user: req.user
    })
})

app.get('/show', Auth.ensureLoggedIn('/login'), (req, res) => {

    Games.findAll().then((el) => {
        const ga = el
        res.render('show', {
            ga
        })
    })
})


app.get('/about', (req, res) => {
    res.render('about')
})


app.get('/game', (req, res) => {
    let ans = req.query.game
    if (ans == undefined) {
        req.flash('error', 'Please Enter Title of Game!!!')
        res.redirect('/')
        return
    }
    res.redirect('/game/' + ans)
})

app.get('/game/:Name', (req, res) => {

    const ans = req.params.Name.toLowerCase()
    Games.findOne({
        where: {
            Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Name')), 'LIKE', '%' + ans + '%')
        },
    }).then((game) => {
        if (!game) {
            req.flash('error', 'Sorry, Game not found!!!')
            res.redirect('/')
            return
        }
        res.render('game', { game, flag })
    }).catch((err) => console.log('error'))
})


app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});


app.get('/login/github', passport.authenticate('github'))

app.get('/login/github/callback', passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

app.get('/login/facebook', passport.authenticate('facebook'))

app.get('/login/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/login/google', passport.authenticate('google', { scope: ['profile'] }));


app.get('/login/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))





app.get('/support', (req, res) => res.render('support'))

app.get('/admin/del', Auth.ensureLoggedIn('/login'), isAdmin, (req, res) => {
    res.render('admindelete', {
        user: req.user
    })
})
/////* GET Ends Here */////



app.post('/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: "/login",
    failureFlash: true,
}))

app.post('/signup', (req, res) => {
    const newuser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    if (newuser.username == '') {
        req.flash('error', 'Please Enter Username!!')
        res.redirect('/signup')
        return
    }
    if (newuser.email == '') {
        req.flash('error', 'Please Enter Valid Email!!')
        res.redirect('/signup')
        return
    }
    if (newuser.password == '') {
        req.flash('error', 'Please Enter Password!!')
        res.redirect('/signup')
        return
    }
    Users.create(newuser).then((el) => {
        res.redirect('/login')
    }).catch((err) => console.log(err))
})


app.post('/game/:Name', Auth.ensureLoggedIn('/login'), (req, res) => {

    const ans = req.params.Name
    if (flag == 1) {
        flag = 0
        Games.findOne({
            where: {
                Name: ans
            }
        }).then((game) => {
            let inc = game.Likes
            inc++
            Games.update(
                { Likes: inc },
                { where: { Name: game.Name } }
            )
                .then((result) =>
                    res.redirect('/game/' + game.Name),

                    console.log('done successfully!!')
                )
                .catch(err =>
                    console.log(err)
                )
        })
    } else {
        flag = 1
        console.log(ans.id)
        Games.findOne({
            where: {
                Name: ans
            }
        }).then((game) => {
            let dec = game.Likes
            dec--
            Games.update(
                { Likes: dec },
                { where: { Name: game.Name } }
            ).then((result) =>
                res.redirect('/game/' + game.Name),

            )
                .catch((err) =>
                    console.log(err)
                )
        })

    }
})



app.post('/admin', (req, res, next) => {
    const newgame = {
        id: req.body.id,
        Name: req.body.title,
        Genre: req.body.genre,
        Image: req.body.image,
        URL: req.body.url,
    }


    if (newgame.id == '' || newgame.Name == '' || newgame.Genre == '' || newgame.Image == '' || newgame.URL == '') {
        req.flash('error', 'Please fill all the Details!!!')
        res.redirect('/admin')
        return
    }
    Games.create(newgame).then((el) => {
        req.flash('successMessage', 'Game was added successfully!!!')
        res.redirect('/admin')
    }).catch((err) => console.log(err))

})

app.post('/admin/del', (req, res) => {
    Games.destroy({
        where: {
            id: req.body.ID,
        },
    }).then((game) => {
        if (!game) {
            req.flash('error', 'Game not Found!!!')
            res.redirect('/admin/del')
            return
        }
        console.log('deleted')
        res.redirect('/')
    }).catch((err) => console.log(err))
})

/// POST Ends Here!!!!

app.use(express.static(path.join(__dirname, '/public')))

app.use(express.static(path.join(__dirname, '/public/images')))

app.use('/admin', express.static(__dirname + '/public'))

db.sync().then(() => {
    app.listen(7890, (req, res) => {
        console.log('listening to http://localhost:7890')
    })
})