const express = require('express');
const router = express.Router();

const jwt = require('utility/jwt');
const db = require('utility/db');
const sql = require('./sql');

const controller = require('./controller');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  console.log(token);

  if (!token) {
    return res.status(403).json({
      status: false,
      message: '권한이 없습니다.'
    });
  }

  try {
    const decoded = await jwt.verify(token);
    const get = db.connect(async (conn, email) => {
      return await conn.query(`SELECT type FROM admin WHERE email = ?`, [email]);
    });

    const [rows, fields] = await get(decoded.email);

    if (!rows.length) throw new Error;

    const { type } = rows[0];

    if (type !== 'ADMIN') throw new Error;
    next();
  } catch(e) {
    res.status(403).json({
      status: false,
      message: '권한이 없습니다.'
    });
  }
}

router.use(authMiddleware);
router.post('/uploadImage', controller.uploadImage);
router.post('/add', controller.addBranch);
router.post('/screenAdd', controller.addScreen);

module.exports = router;