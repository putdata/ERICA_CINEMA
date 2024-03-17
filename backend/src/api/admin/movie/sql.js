const insertMovie = `
INSERT INTO movie (code, title, title_en, run_time, product_year, nation, open, synopsis, watch_grade, thumbnail, show_status)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const insertStillCut = `
INSERT INTO movie_stillcut (movie_code, id, is_external, img)
VALUES (?, ?, ?, ?)
`;

const SetZeroMovie = `
UPDATE movie
SET score_rate = 0, book_rate = 0
`

const TotalBooked = `
SELECT COUNT(movie_code) as total
FROM ticket_book
WHERE movie_code IN (SELECT code FROM movie WHERE show_status = 1)
`

const GroupBooked = `
SELECT movie_code, COUNT(movie_code) as count
FROM ticket_book
WHERE movie_code IN (SELECT code FROM movie WHERE show_status = 1)
GROUP BY movie_code
`

const SetBookRate = `
UPDATE movie
SET book_rate = ?
WHERE code = ?
`;

const SetCumulative = `
UPDATE movie mv
SET cumulative = (SELECT COUNT(movie_code) FROM ticket_book WHERE movie_code = mv.code AND start < NOW())
WHERE show_status = 1
`

module.exports = {
  insertMovie,
  insertStillCut,
  SetZeroMovie,
  TotalBooked,
  GroupBooked,
  SetBookRate,
  SetCumulative
}