const TheaterList = `
SELECT location, code, name
FROM theater
`;

const ScreenList = `
SELECT code, name, row, col, total_seats
FROM screen
WHERE theater_code = ?
`;

const TheaterInfo = `
SELECT location,  name, address, phone
FROM theater
WHERE code = ?
`;

const TheaterGuideMaps = `
SELECT floor, comment, img
FROM theater_guide_map
WHERE theater_code = ?
ORDER BY floor ASC
`;

const TheaterShowDateList = `
SELECT DATE_FORMAT(start, '%Y-%m-%d') as date
FROM theater_movie_time
WHERE theater_code = ? AND NOW() <= start
GROUP BY date
ORDER BY start ASC
`;

const TheaterShowTimeList = `
SELECT TMT.screen_code, TMT.movie_code, DATE_FORMAT(TMT.start, '%Y-%m-%dT%H:%i:%s.000Z') as start,
  (
    SELECT COUNT(*)
    FROM ticket_book
    WHERE theater_code = TMT.theater_code AND screen_code = TMT.screen_code AND start = TMT.start
  ) AS booked_seats
FROM theater_movie_time TMT
WHERE theater_code = ? AND NOW() <= start AND ? <= start AND start < ? + INTERVAL 1 DAY
ORDER BY start ASC
`;

const MovieInfoList = `
SELECT code, title, run_time, open, watch_grade
FROM movie
WHERE show_status = 1
`

const ScreenSeatList = `
SELECT x, y, code, grade
FROM screen_seat
WHERE theater_code = ? AND screen_code = ?
`;

module.exports = {
  TheaterList,
  ScreenList,
  TheaterInfo,
  TheaterGuideMaps,
  TheaterShowDateList,
  TheaterShowTimeList,
  MovieInfoList,
  ScreenSeatList
}