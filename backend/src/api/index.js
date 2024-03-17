const express = require('express');
const router = express.Router();
const user = require('./user');
const movie = require('./movie');
const theater = require('./theater');
const ticket = require('./ticket');
const admin = require('./admin');

// var userRouter = require('./user');

const logMiddleware = async (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
  console.log(`IP: ${ ip }\n    referer: ${ req.headers['referer'] }\n    originalUrl: ${ req.originalUrl }`);
  next();
}

router.use(logMiddleware);

router.use('/user', user);
router.use('/movie', movie);
router.use('/theater', theater);
router.use('/ticket', ticket);
router.use('/admin', admin);


module.exports = router;