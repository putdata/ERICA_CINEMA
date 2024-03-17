const uuid4 = require('uuid4');

const db = require('utility/db');
const jwt = require('utility/jwt');
const SQL = require('./sql');

exports.movieLocationList = async (req, res) => {
  try {
    const locationList = db.connect(async (conn, movieCode) => {
      const result = await conn.query(SQL.MovieLocationList, [movieCode])
      return result[0];
    });

    res.json({
      ok: true,
      data: await locationList(req.query.movieCode)
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};

exports.movieTheaterList = async (req, res) => {
  try {
    const theaterList = db.connect(async (conn, location, movieCode) => {
      const result = await conn.query(SQL.MovieTheaterList, [location, movieCode])
      return result[0];
    });

    const { location, movieCode } = req.query;

    res.json({
      ok: true,
      data: await theaterList(location, movieCode)
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};

exports.movieDateList = async (req, res) => {
  try {
    const dateList = db.connect(async (conn, theaterCode, movieCode) => {
      const result = await conn.query(SQL.MovieDateList, [theaterCode, movieCode])
      return result[0];
    });

    const { theaterCode, movieCode } = req.query;

    res.json({
      ok: true,
      data: await dateList(theaterCode, movieCode)
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};

exports.movieTimeList = async (req, res) => {
  try {
    const timeList = db.connect(async (conn, theaterCode, movieCode, date) => {
      const result = await conn.query(SQL.MovieTimeList, [theaterCode, movieCode, date, date]);
      return result[0];
    });

    const { theaterCode, movieCode, date } = req.query;
    res.json({
      ok: true,
      data: await timeList(theaterCode, movieCode, date)
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};

exports.bookedSeatList = async (req, res) => {
  try {
    const bookedSeatList = db.connect(async (conn, start, theaterCode, screenCode, movieCode) => {
      const result = await conn.query(SQL.BookedSeatList, [start, theaterCode, screenCode, movieCode]);
      return result[0];
    });

    const { theaterCode, screenCode, movieCode, start } = req.query;
    res.json({
      ok: true,
      data: await bookedSeatList(start, theaterCode, screenCode, movieCode)
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};

exports.selectSeat = async (req, res) => {
  try {
    const selectSeatPrice = db.connect(async (conn, start, theaterCode, screenCode, movieCode, seatCode) => {
      const result = await conn.query(SQL.SelectSeat, [start, theaterCode, screenCode, movieCode, seatCode]);
      if (result[0].length) {
        return false;
      }

      const seatGrade = await conn.query(SQL.SeatGrade, [theaterCode, screenCode, seatCode]);
      const { grade } = seatGrade[0][0];
      let price;
      switch (grade) {
        case 'NORMAL':
          price = 8000;
          break;
        case 'COUPLE':
          price = 10000;
          break;
      }
      const hour = start.slice(11, 13);
      if (0 <= hour && hour < 10) price -= 2000; // 0 ~ 10 시 야간, 조조

      return price;
    });

    const { theaterCode, screenCode, movieCode, start, seatCode } = req.query;
    const price = await selectSeatPrice(start, theaterCode, screenCode, movieCode, seatCode);
    if (price == false) {
      res.json({
        ok: false,
        message: `이미 마감된 자리입니다.`
      });
    } else {
      res.json({
        ok: true,
        data: { seatCode: seatCode, price: price }
      });
    }
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};

exports.pay = async (req, res) => {
  try {
    const pay = db.transaction(async (conn, userEmail, param) => {
      const { theaterCode, screenCode, movieCode, start, selectedSeat } = param;

      let ticketNumber;
      while (1) {
        ticketNumber = start.slice(0, 5) + start.slice(5, 10).replace('-', '') + '-' + uuid4().slice(9, 18).toUpperCase();
        const result = await conn.query(SQL.SelectTicketNumber, [ticketNumber]);
        if (!result[0].length) {
          await conn.query(SQL.InsertTicketNumber, [ticketNumber, userEmail]);
          break;
        }
      }
      console.log(ticketNumber, userEmail);

      let totalPrice = 0;
      const hour = start.slice(11, 13);
      for (const seatCode in selectedSeat) {
        const result = await conn.query(SQL.SelectSeat, [start, theaterCode, screenCode, movieCode, seatCode]);
        if (result[0].length) {
          throw new Error(`좌석 '${ seatCode }' 는 마감된 자리입니다.`);
        }
        await conn.query(SQL.BookSeat, [ticketNumber, theaterCode, screenCode, movieCode, start, seatCode]);

        const seatGrade = await conn.query(SQL.SeatGrade, [theaterCode, screenCode, seatCode]);
        if (!seatGrade[0].length) {
          throw new Error(`좌석 '${ seatCode }' 는 없는 자리입니다.`);
        }
        const { grade } = seatGrade[0][0];
        switch (grade) {
          case 'NORMAL':
            totalPrice += 8000;
            break;
          case 'COUPLE':
            totalPrice += 10000;
            break;
        }
        if (0 <= hour && hour < 10) totalPrice -= 2000; // 0 ~ 10 시 야간, 조조
      }

      if (email !== null) {
        const userMileage = await conn.query(SQL.GetUserMileage, [email]);
        let { grade, mileage, acc_mileage } = userMileage[0][0];
        const calc = Math.floor(totalPrice * 0.05);
        mileage += calc;
        acc_mileage += calc;
        if (acc_mileage < 2500) grade = 'BRONZE';
        else if (acc_mileage < 5000) grade = 'SILVER';
        else grade = 'GOLD';

        await conn.query(SQL.SetUserMileage, [grade, mileage, acc_mileage, email]);
        await conn.query(SQL.InsertPayment, [email, totalPrice, 'TICKET', ticketNumber]);
      }

      return {
        ticketNumber: ticketNumber,
        totalPrice: totalPrice
      };
    });

    const token = req.headers.authorization;
    let email = null;
    try {
      const decoded = await jwt.verify(token);
      email = decoded.email;
    } catch(e) {}

    const result = await pay(email, req.body);
    const { ticketNumber, totalPrice } = result;
    res.json({
      ok: true,
      data: {
        ticketNumber: ticketNumber,
        price: totalPrice
      }
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    })
  }
};