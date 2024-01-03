//INITIALIZE SEQUELIZE

const dbConfig = require("./config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    dialectOptions: {
        typeCast: function (field, next) {
            if (field.type === 'DATETIME' || field.type === 'TIMESTAMP') {
                const utcTimestamp = new Date(field.string() + 'Z');
                const spainOffset = 1;
                const spainTimestamp = new Date(utcTimestamp.getTime() + spainOffset * 60 * 60 * 1000);
                return spainTimestamp;
            }
            return next();
        }
    },
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
db.Trips = require("./models/trips.model.js")(sequelize, Sequelize);
db.Sights = require("./models/sights.model.js")(sequelize, Sequelize);
module.exports = db;