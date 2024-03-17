CREATE TABLE screen (
  theater_code INT UNSIGNED NOT NULL,
  code TINYINT UNSIGNED NOT NULL,
  name VARCHAR(50) NOT NULL,
  row TINYINT UNSIGNED NOT NULL,
  col TINYINT UNSIGNED NOT NULL,
  total_seats TINYINT UNSIGNED NOT NULL,

  PRIMARY KEY (theater_code, code),

  FOREIGN KEY (theater_code)
    REFERENCES theater(code)
);

CREATE TABLE screen_seat (
  theater_code INT UNSIGNED NOT NULL,
  screen_code TINYINT UNSIGNED NOT NULL,
  x TINYINT UNSIGNED NOT NULL,
  y TINYINT UNSIGNED NOT NULL,
  code VARCHAR(4) NOT NULL,
  grade VARCHAR(10) NOT NULL,

  PRIMARY KEY (theater_code, screen_code, x, y),

  FOREIGN KEY (theater_code, screen_code)
    REFERENCES screen(theater_code, code)
);