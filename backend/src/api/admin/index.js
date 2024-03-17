const express = require('express');
const router = express.Router();

const branch = require('./branch');
const movie = require('./movie');
const theater = require('./theater');

router.use('/branch', branch);
router.use('/movie', movie);
router.use('/theater', theater);

module.exports = router;