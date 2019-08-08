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


const Sequelize = require('sequelize')

const db = new Sequelize({
    dialect: 'sqlite',
    storage: 'users.db',
})

const Users = db.define('user', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    liked: {
        type: Sequelize.STRING
    }
})

const Games = db.define('games', {

    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Genre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Image: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    URL: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }

})

module.exports = {
    db,
    Users,
    Games,
    Sequelize
}