const express = require('express')
const session = require('express-session')
const passport = require('./passport')
const flash = require('express-flash')
const cookieParser = require('cookie-parser');
const Auth = require('connect-ensure-login')
const path = require('path')

//var session = require('express-session');
//var flash = require('connect-flash');
let {
    db,
    Users,
    Games,
    Sequelize
} = require('./db')

let games = [{
    id: 1,
    Name: 'GTA 5',
    Genre: 'Action-Adventure, Open-World',
    //Image: 'Background.jpg'
    Image: 'Background.jpg',
    URL: 'https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/'
},
{
    id: 2,
    Name: 'FarCry 3',
    Genre: 'Action-Adventure, Open-World',
    Image: 'Vaas.jpg',
    URL: 'https://store.steampowered.com/app/220240/Far_Cry_3/'
}, {
    id: 3,
    Name: 'Battlefield 3',
    Genre: 'RPG, Shooting',
    Image: 'Battlefield3.jpeg',
    URL: 'https://www.battlefield.com/games/battlefield-3'
}, {
    id: 4,
    Name: 'LIMBO',
    Genre: 'Fantasy, Survival',
    Image: 'Limbo.jpg',
    URL: 'https://store.steampowered.com/app/48000/LIMBO/'
}, {
    id: 5,
    Name: 'Hitman Absolution',
    Genre: 'Stealth, Action-Adventure',
    Image: 'Hitman_Absolution.jpg',
    URL: 'https://store.steampowered.com/app/203140/Hitman_Absolution/'
}, {
    id: 6,
    Name: 'NFS: Most Wanted',
    Genre: 'Open World, Arcade-Racing',
    Image: 'NFS_MW.jpg',
    URL: 'https://www.ea.com/en-gb/games/need-for-speed'
}, {
    id: 7,
    Name: 'The Witcher 3: Wild Hunt',
    Genre: 'Action Role-Playing',
    Image: 'Witcher3.jpg',
    URL: 'https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/'
}, {
    id: 8,
    Name: 'Batman: Arkham Origins',
    Genre: 'Action-Adventure',
    Image: 'Batman.jpg',
    URL: 'https://store.steampowered.com/app/209000/Batman_Arkham_Origins/'
}, {
    id: 9,
    Name: 'Assasins Creed: Odyssey',
    Genre: 'Open World, Action-Adventure',
    Image: 'Assasing_Creed.jpg',
    URL: 'https://store.steampowered.com/app/812140/Assassins_Creed_Odyssey/'
}, {
    id: 10,
    Name: 'Sleeping Dogs',
    Genre: 'Mafia World, Action-Adventure',
    Image: 'SD.jpeg',
    URL: 'https://store.steampowered.com/app/202170/Sleeping_Dogs/'
}

]

let op = {}

let userone = {}

const app = express()


app.set('view engine', 'hbs')

app.use(express.json())

app.use(express.urlencoded({
    extended: true
}))
//app.use(bodyParser.json())
app.use(cookieParser('secret'));

app.use(session({
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

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});

app.get('/', (req, res) => {
    //console.log(req.user.username)
    /* if (Games.length == 0) {
        for (let i = 0; i < games.length; i++) {
            const el = games[i]
            Games.create(el).then(() => {
                console.log('game added')
            }).catch((err) => console.log(err))
        }
    } */
    Games.findAll().then((el) => {

        if (req.user) {
            //console.log(req.user.name)
            const all = el
            res.render('index', {
                user: req.user.username, all
            })
        } else {
            const all = el
            res.render('index', { all })
        }
    })
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/login', (req, res) => {
    res.render('login')
    flag = 1
})

const isAdmin = (req, res, next, ) => {
    console.log('inside in')
    //const url = req.originalUrl

    if (req.user.username == 'test') {
        userone.Name = 'test'
        console.log(userone.Name)
        return next()
    } else {
        req.flash('info', 'Access Denied!!!')
        res.redirect('/')
        return
        //return Auth.ensureLoggedIn('/login')
    }
    console.log('inside checklogged in false')
    res.redirect('/login')
}

app.get('/admin', Auth.ensureLoggedIn('/login'), isAdmin, (req, res) => {
    res.render('admin', {
        user: req.user
    })
})

app.get('/show', Auth.ensureLoggedIn('/login'), (req, res) => {

    Games.findAll().then((el) => {
        //console.log(Games[0])
        const ga = el
        res.render('show', {
            ga
        })
    })
})


app.get('/about', (req, res) => {
    res.render('about')
})

let flag = 1


app.get('/game/:Name', (req, res) => {
    //res.send("Name is set to " + req.params.Name)
    const ans = req.params.Name
    //console.log(ans)
    Games.findOne({
        where: {
            Name: ans
        }
    }).then((game) => {
        //console.log(game.Name + ' ' + game.URL)
        res.render('game', { game })
    }).catch((err) => console.log('error'))
    /* res.render('game', {
        op, flag
    }) */
})

app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

let count = 0


app.get('/login/github', passport.authenticate('github'))

app.get('/login/github/callback', passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
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
/* app.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successReturnToOrRedirect: '/',
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
}); */

app.post('/', (req, res) => {
    const el = req.body.title.toLowerCase()
    Games.findOne({
        where: {
            Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Name')), 'LIKE', '%' + el + '%')
        }

    }).then((game) => {
        if (el == '') {
            req.flash('error', 'PLEASE ENTER TITLE OF GAME!!!')
            res.redirect('/')
            return
        }
        if (!game) {
            req.flash('error', 'Sorry , Game not Found!!!')
            res.redirect('/')
            return
        }
        //op = game
        //console.log(op)
        res.redirect('/game/:Name')

    }).catch((err) => console.log(err))
})

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


app.post('/game', (req, res) => {
    // console.log('Game is', op)
    if (flag == 1) {
        flag = 0
        op.Likes++
        Games.update(
            { Likes: op.Likes },
            { where: { id: op.id } }
        )
            .then((result) =>
                console.log('done successfully!!')
            )
            .catch(err =>
                console.log(err)
            )
    } else {
        flag = 1
        op.Likes--
        console.log(op.id)
        Games.update(
            { Likes: op.Likes },
            { where: { id: 1 } }
        )
            .then((result) =>
                console.log(result)
            )
            .catch((err) =>
                console.log(err)
            )
    }
    res.redirect('/game')
    //res.render('games', { op, flag })
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

    /*  passport.authenticate('admin', {
         successRedirect: '/admin',
         failureRedirect: '/',
         failureFlash: true,
     })(req, res, next) */
})

/* app.delete('/admin/:id', (req, res) => {
    console.log('inside delete')
    Games.destroy({
        where: {
            id: req.params.id,
        },
    }).then((game) => {
        console.log( 'deleted')
        res.redirect('/show')
    }).catch((err) => console.log(err))
}) */

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


app.use('/', express.static(__dirname + '/public'))

app.use('/', express.static(__dirname + '/public/images'))

app.use('/admin', express.static(__dirname + '/public'))

app.use('/admin', express.static(__dirname + 'public/images'))

app.use(express.static(path.join(__dirname, '/public')))

app.use(express.static(path.join(__dirname, '/public/images')))


/* app.use(express.static(__dirname + '/public'))

app.use(express.static(__dirname + '/public/images')) */

//app.use('/', path.join(__dirname + '/public/images'))


db.sync().then(() => {
    app.listen(7890, (req, res) => {
        console.log('listening to http://localhost:7890')
    })
})