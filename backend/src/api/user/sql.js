const searchEmail = `
SELECT email
FROM user
WHERE email=?
`;

const login = `
SELECT email, name
FROM user
WHERE email=? AND password=?
`;

const register = `
INSERT INTO user (email, name, password, age)
VALUES (?, ?, ?, ?);
`;

const CheckAdmin = `
SELECT type
FROM admin
WHERE email = ?
`;

const UserInfo = `
SELECT grade, mileage, acc_mileage
FROM user
WHERE email = ?
`

const PaymentInfo = `
SELECT time, price, type, serial_number
FROM payment
WHERE email = ?
ORDER BY time DESC
`;

const PaymentPrice = `
SELECT price
FROM payment
WHERE email = ? AND serial_number = ?
`

const CheckMovieTime = `
SELECT start
FROM ticket_book
WHERE ticket_serial_number = ? AND NOW() < start
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

const DeleteTicket = `
DELETE FROM ticket
WHERE serial_number = ?
`

const DeleteBookedSeat = `
DELETE FROM ticket_book
WHERE ticket_serial_number = ?
`

const DeletePayment = `
DELETE FROM payment
WHERE serial_number = ?
`

module.exports = {
  searchEmail,
  login,
  register,
  CheckAdmin,
  UserInfo,
  PaymentInfo,
  PaymentPrice,
  CheckMovieTime,
  DeleteTicket,
  DeleteBookedSeat,
  DeletePayment,
  GetUserMileage,
  SetUserMileage,
}