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

// 定時向 MySQL 發送查詢，避免連線超時斷線，每隔6小時執行一次
setInterval(
  () => pool.query("SELECT 1", (err) => console.error(err)),
  6 * 60 * 60 * 1000 // 6小時 (小時數 * 分鐘數 * 秒數 * 毫秒數)
);

module.exports = pool.promise();
