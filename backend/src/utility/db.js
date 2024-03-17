const mysqldb = require('mysql2/promise');
const dbConfig = require('../config/db.config');

const pool = mysqldb.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  connectionLimit: 10
});

exports.pool = pool;

exports.connect = (func) => async (...args) => {
  const conn = await pool.getConnection();

  const result = await func(conn, ...args).catch(err => {
    conn.release();
    throw err;
  });

  conn.release();

  return result;
};

exports.transaction = (func) => async (...args) => {
  const conn = await pool.getConnection();

  await conn.beginTransaction();

  const result = await func(conn, ...args).catch(async (err) => {
    await conn.rollback();
    conn.release();
    throw err;
  });

  await conn.commit();
  conn.release();

  return result;
};