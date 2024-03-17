const insertTheater = `
INSERT INTO theater (code, location, name, address, phone)
VALUES (?, ?, ?, ?, ?)
`;

const insertGuideMap = `
INSERT INTO theater_guide_map (theater_code, floor, comment, img)
VALUES (?, ?, ?, ?)
`;

const insertScreen = `
INSERT INTO screen VALUES (?, ?, ?, ?, ?, ?)
`;

const insertSeat  =  `
INSERT INTO screen_seat  VALUES (?, ?, ?, ?, ?, ?)
`;

module.exports = {
  insertTheater,
  insertGuideMap,
  insertScreen,
  insertSeat
}