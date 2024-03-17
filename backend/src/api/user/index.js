const express = require('express');
const router = express.Router();

const jwt = require('utility/jwt');
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
    if (decoded.email != (req.query.email || req.body.email)) throw new Error;
    next();
  } catch(e) {
    res.status(403).json({
      status: false,
      message: '권한이 없습니다.'
    });
  }
}

router.post('/verify', controller.userTokenVerify);
router.post('/login', controller.userLogin);
router.post('/register', controller.userRegister);
router.get('/userinfo', authMiddleware, controller.userInfo);
router.get('/paymentInfo', authMiddleware, controller.paymentInfo);
router.post('/cancelTicket', authMiddleware, controller.cancelTicket);

module.exports = router;