const MovieLocationList =  `
SELECT location, COUNT(location) AS count
FROM theater
WHERE code IN (SELECT theater_code
               FROM theater_movie_time
               WHERE NOW() <= start AND movie_code = ?
               GROUP BY theater_code)
GROUP BY location
ORDER BY count DESC
`;

const MovieTheaterList = `
SELECT code, name
FROM theater
WHERE location = ? AND code IN (SELECT theater_code
                                FROM theater_movie_time
                                WHERE NOW() <= start AND movie_code = ?
                                GROUP BY theater_code);
`;

const MovieDateList = `
SELECT DATE_FORMAT(start, '%Y-%m-%d') as date
FROM theater_movie_time
WHERE theater_code = ? AND movie_code = ? AND NOW() <= start
GROUP BY date
ORDER BY start ASC
`;

const MovieTimeList = `
SELECT TMT.screen_code, DATE_FORMAT(TMT.start, '%Y-%m-%d %H:%i:%s') as start,
  (
    SELECT COUNT(*)
    FROM ticket_book
    WHERE theater_code = TMT.theater_code AND screen_code = TMT.screen_code AND start = TMT.start
  ) AS booked_seats
FROM theater_movie_time TMT
WHERE theater_code = ? AND movie_code = ? AND NOW() <= start AND ? <= start AND start < ? + INTERVAL 1 DAY
ORDER BY start ASC
`;

const ScreenSeat = `
SELECT x, y, code, grade
FROM screen_seat
WHERE theater_code = ? AND screen_code = ?
`;

const BookedSeatList = `
SELECT seat_code
FROM ticket_book
WHERE start = ? AND theater_code = ? AND screen_code = ? AND movie_code = ?
`

const SelectSeat = `
SELECT seat_code
FROM ticket_book TB
WHERE start = ? AND theater_code = ? AND screen_code = ? AND movie_code = ? AND seat_code = ?
`;

const SeatGrade = `
SELECT grade
FROM screen_seat
WHERE theater_code = ? AND screen_code = ? AND code = ?
`;

const SelectTicketNumber = `
SELECT serial_number
FROM ticket
WHERE serial_number = ?
`;

const InsertTicketNumber = `
INSERT INTO ticket
VALUES (?, ?)
`;

const BookSeat = `
INSERT INTO ticket_book
VALUES (?, ?, ?, ?, ?, ?)
`;

const GetUserMileage = `
SELECT grade, mileage, acc_mileage
FROM user
WHERE email = ?
`;

const SetUserMileage = `
UPDATE user
SET grade = ?, mileage = ?, acc_mileage = ?
WHERE email = ?
`;

const InsertPayment = `
INSERT INTO payment (email, price, type, serial_number)
VALUES (?, ?, ?, ?)
`

module.exports = {
  MovieLocationList,
  MovieTheaterList,
  MovieDateList,
  MovieTimeList,
  ScreenSeat,
  BookedSeatList,
  SelectSeat,
  SeatGrade,
  SelectTicketNumber,
  InsertTicketNumber,
  BookSeat,
  GetUserMileage,
  SetUserMileage,
  InsertPayment
}