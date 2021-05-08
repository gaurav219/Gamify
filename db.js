const Knex = require("knex");

const knexfile = require("./knexfile");

const knex = Knex(knexfile.development);

const { Model } = require("objection");

Model.knex(knex);

const { User } = require("./models/User");
const { Games } = require("./models/Games");
const { raw } = require("objection");

const func = async () => {
  // SELECT COUNT("ID"), "Title" FROM games GROUP BY "Title";
  const games = await Games.query()
    .select(raw('count("ID")'), "Title")
    .groupBy("Title")
    .orderBy("count", "desc");
  console.log(games);
};

//const id = req.user.ID;

const { AllGames } = require("./models/AllGames");

const title = "gta";

User.relatedQuery("games")
  .for(102)
  // .where("ID", 100)
  .then((s) => {
    console.log(s);
    // s.forEach((d) => console.log(d));
  });
// User.query()
//   .findById(102)
//   .then((user) => {
//     user.$fetchGraph()
//    // user.$relatedQuery("games").then((games) => {
//       games.forEach((g) => {
//         console.log(g);
//       });
//     });
//   });

//Games.query()
//AllGames.select("*")
//   .distinct("ID", "Title", "Genre", "Image", "URL")
//   .where(raw('lower("Title")'), "like", "%" + title + "%")
//   .then((curr) => {
//     console.log(curr);
//   });

// AllGames.select("*")
//   .where(knex.raw('LOWER("Title")'), "like", "%" + "gta" + "%")

//.distinct("ID", "Title", "Genre", "Image", "URL")
//.where('lower("Title")'), "like", "%" + req.params.Name + "%")
// .then((curr) => {
//   console.log(curr);
// });

// AllGames.select("Title")
//   .where(knex.raw('LOWER("Title")'), "like", `%${title}%`)
//   //.orderBy("Likes", "desc")
//   .then((s) => {
//     console.log(s);
//   });

// User.query()
//   .findById(id)
//   .then((s) => {
//     s.$relatedQuery("games")
//       .select("*")
//       .then((s) => {
//         s.every((game) => {
//           if (game.Title === "GTA 5") {
//             flag = 1;
//             return false;
//           }

//           return true;
//         });
//       });
//   });

///.then((s) => console.log(s));

// Games.query()
//   .select(raw('count("ID")'), 'Title')
//   .groupBy('Title')
//   .orderBy('count', 'desc')
//   .then((game) => {
//     console.log(game.Title);
//   });

// const ans = 'test2021';

// Games.query()
//   .distinct('ID', 'Title', 'Genre', 'Image', 'URL')
//   .then((user) => console.log(user));

// Games.query()
//   .distinct('ID', 'Title', 'Genre', 'Image', 'URL')

//   .where(raw('lower("Title")'), 'like', '%' + ans + '%')

//   .then((game) => {
//     if (game.length == 0) {
//     } else console.log(game);
//   });

// dbfunc();

/* const Sequelize = require('sequelize')



const sequelize = new Sequelize('test', 'root', 'root', {

    dialect: 'sqlite',
    storage: 'users.db'

})

const Users = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = {
    sequelize,
    Users
} */

// const Sequelize = require('sequelize')

// const db = new Sequelize({
//     dialect: 'sqlite',
//     storage: 'users.db',
// })

// const Users = db.define('user', {
//     username: {
//         type: Sequelize.STRING,
//         unique: true,
//         allowNull: true,
//     },
//     email: {
//         type: Sequelize.STRING,
//         unique: true,
//         allowNull: true,
//     },
//     password: {
//         type: Sequelize.STRING,
//         allowNull: true,
//     },
//     liked: {
//         type: Sequelize.STRING
//     }
// })

// const Games = db.define('games', {

//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         primaryKey: true
//     },
//     Name: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     Genre: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     Image: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     URL: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     Likes: {
//         type: Sequelize.INTEGER,
//         defaultValue: 0
//     }

// })

// module.exports = {
//     db,
//     Users,
//     Games,
//     Sequelize
// }
