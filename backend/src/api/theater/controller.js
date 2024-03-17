const db = require('utility/db');
const SQL = require('./sql');

exports.theaterList = async (req, res) => {
  try {
    const getTheaterList = db.connect(async (conn) => {
      const res = await conn.query(SQL.TheaterList);

      if (!res[0].length) throw new Error('영화관이 존재하지 않습니다.');

      return res[0];
    });

    res.json({
      ok: true,
      data: await getTheaterList()
    })
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};

exports.screenList = async (req, res) => {
  try {
    const getScreenList = db.connect(async (conn, theaterCode) => {
      const res = await conn.query(SQL.ScreenList, [theaterCode]);

      // if (!res[0].length) throw new Error('상영관이 존재하지 않습니다.');

      return res[0];
    });
    
    res.json({
      ok: true,
      data: await getScreenList(req.query.theaterCode)
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};

exports.theaterDetail = async (req, res) => {
  try {
    const theaterDetail = db.connect(async (conn, theaterCode) => {
      const info = await conn.query(SQL.TheaterInfo, [theaterCode]);
      const guideMaps = await conn.query(SQL.TheaterGuideMaps, [theaterCode]);

      if (!info[0].length) throw new Error('존재하지 않는 영화관');

      return {
        info: info[0][0],
        guideMaps: guideMaps[0]
      };
    });

    res.json({
      ok: true,
      data: await theaterDetail(req.query.theaterCode)
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};

exports.theaterShowDateList = async (req, res) => {
  try {
    const dateList = db.connect(async (conn, theaterCode) => {
      const result = await conn.query(SQL.TheaterShowDateList, [theaterCode]);
      return result[0];
    });

    res.json({
      ok: true,
      data: await dateList(req.query.theaterCode)
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};

exports.theaterShowTimeList = async (req, res) => {
  try {
    const timeList = db.connect(async (conn, theaterCode, date) => {
      const result = await conn.query(SQL.TheaterShowTimeList, [theaterCode, date, date]);
      return result[0];
    });

    const { theaterCode, date } = req.query;
    res.json({
      ok: true,
      data: await timeList(theaterCode, date)
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};

exports.movieInfo = async(req, res) => {
  try {
    const movieList = db.connect(async (conn) => {
      const result = await conn.query(SQL.MovieInfoList);
      return result[0];
    });

    res.json({
      ok: true,
      data: await movieList()
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    })
  }
};

exports.screenSeatList = async(req, res) => {
  try {
    const screenSeatList = db.connect(async (conn, theaterCode, screenCode) => {
      const result = await conn.query(SQL.ScreenSeatList, [theaterCode, screenCode]);
      return result[0];
    });

    const { theaterCode, screenCode } = req.query;
    res.json({
      ok: true,
      data: await screenSeatList(theaterCode, screenCode)
    })
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
}