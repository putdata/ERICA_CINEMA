const multer = require('multer');
const uuid4 = require('uuid4');

const db = require('utility/db');
const SQL = require('./sql');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/movie/')
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

exports.addMovie = async (req, res) => {
  try {
    const insertMovie = db.transaction(async (conn, data) => {
      const { code, title, titleEn, runTime, productYear, nation, open, synopsis, watchGrade, showStatus, thumbnail, stillCuts } = data;
      if (!code) throw new Error('영화 고유번호 공백');

      await conn.query(SQL.insertMovie, [code, title, titleEn, runTime, productYear, nation, open, synopsis, watchGrade, thumbnail, showStatus]);
      console.log(stillCuts);
      for (let i = 0; i < stillCuts.length; i++) {
        const { isExternalImg, img } = stillCuts[i];
        await conn.query(SQL.insertStillCut, [code, i, isExternalImg, img]);
      }
    });

    await insertMovie(req.body);
    res.json({
      ok: true,
      message: `영화 추가 완료`
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    })
  }
};

exports.bookRate = async (req, res) => {
  try {
    const set = db.transaction(async (conn) => {
      await conn.query(SQL.SetZeroMovie);

      const totalRes = await conn.query(SQL.TotalBooked);
      const total = totalRes[0][0].total;
      const groupRes = await conn.query(SQL.GroupBooked);
      const group = groupRes[0];


      for (const { movie_code, count } of group) {
        await conn.query(SQL.SetBookRate, [count / total * 100, movie_code]);
      }
    });

    await set();
    res.json({
      ok: true
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
}

exports.cumulative = async (req, res) => {
  try {
    const set = db.transaction(async (conn) => {
      await conn.query(SQL.SetCumulative);
    })

    await set();
    res.json({
      ok: true
    })
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
}