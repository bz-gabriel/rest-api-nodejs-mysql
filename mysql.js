const mysql = require('mysql2');

var pool = mysql.createPool({
    "host": process.env.MYSQL_HOST,
    "user": process.env.MYSQL_USER,
    "database": process.env.MYSQL_DATABASE,
    "password": process.env.MYSQL_PASSWORD,
    "port": process.env.MYSQL_PORT
});

exports.pool = pool;