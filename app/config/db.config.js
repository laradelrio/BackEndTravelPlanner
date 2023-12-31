//Configure MySQL database & Sequelize

const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
    
dotenv.config({path: './.env'}); 

module.exports = {
    HOST: process.env.DATABASE_HOST,
    USER: process.env.DATABASE_USER,
    PASSWORD: process.env.DATABASE_PASSWORD,
    DB: process.env.DATABASE,
    dialect: "mysql",
    pool: {  //optional part
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };