CREATE TABLE ticket (
  serial_number VARCHAR(50) NOT NULL,
  user_email VARCHAR(100),

  PRIMARY KEY (serial_number)
);

CREATE TABLE ticket_book (
  ticket_serial_number VARCHAR(50) NOT NULL,
  theater_code INT UNSIGNED NOT NULL,
  screen_code TINYINT UNSIGNED NOT NULL,
  movie_code VARCHAR(20) NOT NULL,
  start DATETIME NOT NULL,
  seat_code VARCHAR(4) NOT NULL,

  PRIMARY KEY (theater_code, screen_code, movie_code, start, seat_code),

  FOREIGN KEY (theater_code, screen_code, movie_code, start)
    REFERENCES theater_movie_time(theater_code, screen_code, movie_code, start)
);