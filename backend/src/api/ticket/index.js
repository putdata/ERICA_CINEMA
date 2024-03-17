const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/movieLocationList', controller.movieLocationList);
router.get('/movieTheaterList', controller.movieTheaterList);
router.get('/movieDateList', controller.movieDateList);
router.get('/movieTimeList', controller.movieTimeList);
router.get('/bookedSeatList', controller.bookedSeatList);
router.get('/selectSeat', controller.selectSeat);
router.post('/pay', controller.pay);

module.exports = router;