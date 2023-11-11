//INITIALIZE SEQUELIZE

const dbConfig = require("./config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER ,dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0, //boolean value is deprecated
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// require model of db users table
db.Users = require("./models/users.model.js")(sequelize, Sequelize);

module.exports = db;