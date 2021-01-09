const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'weather-app',
    password: 'C2546$6689t'
});

module.exports = pool.promise();