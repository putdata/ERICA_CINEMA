const db = require('utility/db');
const SQL = require('./sql');

exports.movieList = async(req, res) => {
  try {
    const getMovieList = db.connect(async (conn, type) => {
      if (!type) return await conn.query(SQL.MovieList);
      return await conn.query(
        type === 'book' ? SQL.MovieListBookRate :
        type === 'cumulative' ? SQL.MovieListCumulative :
        SQL.MovieListScoreRate
      );
    });
    const [rows, fields] = await getMovieList(req.query.type);
    res.json({
      ok: true,
      data: rows
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    });
  }
};

exports.movieDetail = async(req, res) => {
  try {
    const getMovieDetail = db.connect(async (conn, code) => {
      const info = await conn.query(SQL.MovieDetail, [code])
      const stillCuts = await conn.query(SQL.MovieStillCut, [code])

      if (!info[0].length) throw new Error('존재하지 않는 영화입니다.');

      return {
        info: info[0][0],
        stillCuts: stillCuts[0]
      }
    });

    res.json({
      ok: true,
      data: await getMovieDetail(req.query.code)
    });
  } catch(e) {
    res.json({
      ok: false,
      message: `${ e.message }`
    })
  }
};