const mysql = require('mysql');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE
};

const pool = mysql.createPool(dbConfig);

const getDBConnection = () => {
    return mysql.createConnection(dbConfig);
};

module.exports = {
    pool,
    getDBConnection
};