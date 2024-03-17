const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/movieList', controller.movieList);
router.get('/movieDetail', controller.movieDetail);

module.exports = router;