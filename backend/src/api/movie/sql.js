const MovieList = `
SELECT code, title, watch_grade
FROM movie
WHERE show_status = 1
ORDER BY book_rate DESC
`;

const MovieListCumulative = `
SELECT code, title, watch_grade, thumbnail, cumulative, book_rate, score_rate
FROM movie
WHERE show_status = 1
ORDER BY cumulative DESC
`;

const MovieListBookRate = `
SELECT code, title, watch_grade, thumbnail, cumulative, book_rate, score_rate
FROM movie
WHERE show_status = 1
ORDER BY book_rate DESC
`;

const MovieListScoreRate = `
SELECT code, title, watch_grade, thumbnail, cumulative, book_rate, score_rate
FROM movie
WHERE show_status = 1
ORDER BY score_rate DESC
`;

const MovieDetail = `
SELECT *
FROM movie
WHERE code = ?
`;

const MovieStillCut = `
SELECT is_external, img
FROM movie_stillcut
WHERE movie_code = ?
`;

module.exports = {
  MovieList,
  MovieListCumulative,
  MovieListBookRate,
  MovieListScoreRate,
  MovieDetail,
  MovieStillCut,
}