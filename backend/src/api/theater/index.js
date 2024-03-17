const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/theaterList', controller.theaterList);
router.get('/screenList', controller.screenList);
router.get('/theaterDetail', controller.theaterDetail);
router.get('/showDateList', controller.theaterShowDateList);
router.get('/showTimeList', controller.theaterShowTimeList);
router.get('/movieInfo', controller.movieInfo);
router.get('/screenSeatList', controller.screenSeatList);

module.exports = router;