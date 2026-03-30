/**
 * 数据库连接模块
 * 负责：
 * 1.创建MySQL连接
 * 2，初始化数据库连接
 * 3.对外暴露db实例
 */


const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Connected to database failed:', err);
    return;
  }
  console.log('Connected to database');
  connection.release();
});

module.exports = pool;
