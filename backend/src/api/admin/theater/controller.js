const db = require('utility/db');
const SQL = require('./sql');

exports.addMovieTime = async (req, res) => {
  try {
    const insertMovieTime = db.transaction(async (conn, data) => {
      const { theaterCode, screenCode, movieCode, date, hours, minutes } = data;
      if (theaterCode === undefined || !screenCode || !movieCode || !date || !hours || !minutes) throw new Error('필드를 모두 채워주세요.');
      if (hours < 0 || hours > 23) throw new Error('시간 은 0~23 사이의 값 이어야 합니다.')
      if (minutes < 0 || minutes > 59) throw new Error('분 은 0~59 사이의 값 이어야 합니다.')

      let requestTime = new Date(date);
      requestTime.setHours(hours);
      requestTime.setMinutes(minutes);
      const timezoneOffset = requestTime.getTimezoneOffset() * 60000;
      const timezoneDate = new Date(requestTime - timezoneOffset);
      const leftTime = new Date(timezoneDate).setMinutes(timezoneDate.getMinutes() - 15);
      
      let result = await conn.query(SQL.getMovieRunTime, [movieCode]);
      if (!result[0].length) throw new Error('영화가 run_time을 가지고 있지 않습니다.');

      const movieRunTime = result[0][0]["run_time"];
      console.log(movieRunTime);

      const toDateTime = (jsDate) => {
        return new Date(jsDate).toISOString().slice(0, 19).replace('T', ' ');
      };

      const rightTime = new Date(timezoneDate).setMinutes(timezoneDate.getMinutes() + movieRunTime + 25); // 10분 광고, 15분 청소

      const startTime = toDateTime(timezoneDate);
      const endTime = toDateTime(rightTime);

      console.log(startTime, endTime);

      result = await conn.query(SQL.checkTimeValid, [theaterCode, screenCode, startTime, startTime, endTime, endTime, startTime, endTime, startTime, endTime]);

      console.log(result[0]);
      if (result[0].length) throw new Error('이 시간대에 영화를 추가 할 수 없습니다.');

      await conn.query(SQL.insertMovieTime, [theaterCode, screenCode, movieCode, startTime, endTime]);
    });

    await insertMovieTime(req.body);
    res.json({
      ok: true,
      message: `상영관 영화 시간 추가 완료`
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    })
  }
};

exports.screenMovieTimeList = async (req, res) => {
  try {
    const getMovieTimeList = db.connect(async (conn, param) => {
      const { theaterCode, screenCode, date } = param;
      if (theaterCode === undefined || !screenCode || !date) throw new Error('불러올 수 없습니다.')
      const result = await conn.query(SQL.getScreenMovieTimeList, [theaterCode, screenCode, date, date]);
      console.log(result[0]);
      return result[0];
    });

    res.json({
      ok: true,
      data: await getMovieTimeList(req.query)
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    })
  }
}