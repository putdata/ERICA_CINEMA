const multer = require('multer');
const uuid4 = require('uuid4');

const db = require('utility/db');
const SQL = require('./sql');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/theater/')
  },
  filename: function (req, file, cb) {
    cb(null, `${ uuid4() }.${ file.mimetype.split('/')[1] }`)
  }
});

const upload = multer({ storage: storage }).single('file');

exports.uploadImage = async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: err
      });
    }
    return res.json({
      ok: true,
      path: req.file.path
    });
  });
};

exports.addBranch = async (req, res) => {
  try {
    const insertBranch = db.transaction(async (conn, data) => {
      const { code, location, name, address, phone, guideMaps } = data;
      if (!code || !name) throw new Error('영화관 고유번호 또는 이름 공백');

      await conn.query(SQL.insertTheater, [code, location, name, address, phone]);
      console.log(guideMaps);
      for (const { floor, comment, img } of guideMaps) {
        await conn.query(SQL.insertGuideMap, [code, floor, comment, img]);
      }
    });

    await insertBranch(req.body);
    res.json({
      ok: true,
      message: `영화관 추가 완료`
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    })
  }
};

exports.addScreen = async (req, res) => {
  try {
    const insertScreen = db.transaction(async (conn, data) => {
      const { theaterCode, screenCode, screenName, row, column, disabled, seats } = data;
      if (!theaterCode || !screenCode || !screenName) throw new Error("입력 공백 존재");
      if (!row || !column) throw new Error("좌석 행 또는 열은 0이 될 수 없습니다.");
      
      const totalSeats = row * column - disabled;
      // 스크린 먼저 추가
      await conn.query(SQL.insertScreen, [theaterCode, screenCode, screenName, totalSeats, row, column]);

      // 좌석들 추가
      for (const arr of seats) {
        let idx = 1;
        for (const { x, y, disable, grade } of arr) {
          if (disable) continue;
          const code = `${ String.fromCharCode(65 + x - 1) }${ idx++ }`
          await conn.query(SQL.insertSeat, [theaterCode, screenCode, x, y, code, grade]);
        }
      }
    });

    await insertScreen(req.body);
    res.json({
      ok: true,
      message: `상영관 추가 완료`
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
}