/*var mysql = require('mysql2');

var connection = mysql.createConnection({
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "databese": process.env.MYSQL_DATABASE,
    "host": process.env.MYSQL_HOST,
    "port": process.env.MYSQL_PORT
});
connection.connect(function (err) {
    if (err) {
        console.error('error connecting' + err.stack);
        return;
    }
    console.log('connected as id' + connection.threadId);
});
module.exports = { connection };*/
const mysql = require('mysql2');

var pool = mysql.createPool({
    "host": process.env.MYSQL_HOST,
    "user": process.env.MYSQL_USER,
    "database": process.env.MYSQL_DATABASE,
    "password": process.env.MYSQL_PASSWORD,
    "port": process.env.MYSQL_PORT
});

exports.pool = pool;