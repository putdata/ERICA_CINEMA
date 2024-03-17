CREATE TABLE theater_movie_time (
  theater_code INT UNSIGNED NOT NULL,
  screen_code TINYINT UNSIGNED NOT NULL,
  movie_code VARCHAR(20) NOT NULL,
  start DATETIME NOT NULL,
  end DATETIME NOT NULL,

  PRIMARY KEY (theater_code, screen_code, movie_code, start),

  FOREIGN KEY (theater_code, screen_code)
    REFERENCES screen(theater_code, code),

  FOREIGN KEY (movie_code)
    REFERENCES movie(code)
);