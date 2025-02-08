const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.HOST,
  port: process.env.DBPORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

module.exports = pool.promise();
