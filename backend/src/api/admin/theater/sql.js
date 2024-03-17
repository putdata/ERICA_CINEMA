const getScreenMovieTimeList = `
SELECT DATE_FORMAT(start, '%Y-%m-%dT%H:%i:%s.000Z') as start, DATE_FORMAT(end, '%Y-%m-%dT%H:%i:%s.000Z') as end
FROM theater_movie_time
WHERE theater_code = ? AND screen_code = ? AND ? <= start AND start < ? + INTERVAL 1 DAY
ORDER BY start ASC
`;

const insertMovieTime = `
INSERT INTO theater_movie_time
VALUES (?, ?, ?, ?, ?)
`;

const getMovieRunTime = `
SELECT run_time
FROM movie
WHERE code = ?
`;

const checkTimeValid = `
SELECT screen_code, start, end
FROM theater_movie_time
WHERE theater_code = ? AND screen_code = ? AND ((start <= ? AND ? <= end) || (start <= ? AND ? <= end) || (? <= start AND start <= ?) || (? <= end AND end <= ?))
`;

module.exports = {
  getScreenMovieTimeList,
  insertMovieTime,
  getMovieRunTime,
  checkTimeValid,
}