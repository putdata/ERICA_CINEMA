CREATE TABLE theater(
   code INT UNSIGNED NOT NULL,
   location VARCHAR(20),
   name VARCHAR(20) NOT NULL,
   address VARCHAR(200),
   phone VARCHAR(20),

   PRIMARY KEY(code)
);

CREATE TABLE theater_guide_map(
   theater_code INT UNSIGNED NOT NULL,
   floor SMALLINT NOT NULL,
   comment VARCHAR(50),
   img VARCHAR(200),

   PRIMARY KEY(theater_code, floor),

   FOREIGN KEY(theater_code)
      REFERENCES theater(code)
);

CREATE TABLE screen(
   theater_code INT UNSIGNED NOT NULL,
   code INT UNSIGNED NOT NULL,
   type VARCHAR(10),
   name VARCHAR(100),

   PRIMARY KEY(screen_code, code),

   FOREIGN KEY(theater_code)
      REFERENCES theater(code)
);

CREATE TABLE seat(
   screen_code INT UNSIGNED NOT NULL,
   seat_num VARCHAR(10),
   level VARCHAR(5),
   
   PRIMARY KEY(screen_code, seat_num),

   FOREIGN KEY(screen_code)
      REFERENCES screen(screen_code)
);

CREATE TABLE product(
   code INT UNSIGNED NOT NULL AUTO_INCREMENT,
   name VARCHAR(20),
   theater_code INT UNSIGNED NOT NULL,
   total INT(100),
   faulty INT(100),

   PRIMARY KEY(code),

   FOREIGN KEY(theater_code)
      REFERENCES theater(code)
);


CREATE TABLE franchise(
   code INT UNSIGNED NOT NULL AUTO_INCREMENT,
   store_name VARCHAR(30),
   theater_code INT UNSIGNED NOT NULL,

   PRIMARY KEY(code),

   FOREIGN KEY(theater_code)
      REFERENCES theater(code)
);

CREATE TABLE food(
   food_code INT UNSIGNED NOT NULL AUTO_INCREMENT,
   theater_code INT UNSIGNED NOT NULL,
   name VARCHAR(20),
   category VARCHAR(10),
   price INT(10),
   quantitiy INT(10),

   PRIMARY KEY(food_code, theater_code),

   FOREIGN KEY(theater_code)
      REFERENCES theater(code)
   
);

CREATE TABLE movie (
  code INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(100),
  title_en VARCHAR(100),
  run_time SMALLINT,
  synopsis TEXT, -- 줄거리
  product_year VARCHAR(10), -- 제작년도
  nation VARCHAR(50), -- 제작국가
  open VARCHAR(10), -- 개봉일
  watch_grade VARCHAR(10),
  show_status BOOLEAN DEFAULT 0 NOT NULL,

  PRIMARY KEY (code)
);

CREATE TABLE movie_genre (
  movie_code INT UNSIGNED NOT NULL,
  genre_code TINYINT UNSIGNED NOT NULL,

  PRIMARY KEY (movie_code, genre_code),

  FOREIGN KEY (movie_code)
    REFERENCES movie(code),

  FOREIGN KEY (genre_code)
    REFERENCES genre(code)
);

CREATE TABLE genre (
  code TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50),
  name_en VARCHAR(50),

  PRIMARY KEY (code)
);

CREATE TABLE movie_showtype (
  movie_code INT UNSIGNED NOT NULL,
  type VARCHAR(10) NOT NULL, -- film, 2d, 3d, 4d, imax 등등

  PRIMARY KEY (movie_code, type),

  FOREIGN KEY (movie_code)
    REFERENCES movie(code)
);

CREATE TABLE movie_service (
  movie_code INT UNSIGNED NOT NULL,
  company_code INT UNSIGNED NOT NULL,
  type VARCHAR(20) NOT NULL, -- 제작, 배급, 수입 타입

  PRIMARY KEY (movie_code, company_code, type),

  FOREIGN KEY (movie_code)
    REFERENCES movie(code),

  FOREIGN KEY (company_code)
    REFERENCES company(code)
);

CREATE TABLE company ( -- 배급사, 제작사 등
  code INT UNSIGNED NOT NULL,
  name VARCHAR(100),
  name_en VARCHAR(100),

  PRIMARY KEY (code)
);

CREATE TABLE movie_director (
  movie_code INT UNSIGNED NOT NULL,
  director_code INT UNSIGNED NOT NULL,

  PRIMARY KEY (movie_code, director_code),

  FOREIGN KEY (movie_code)
    REFERENCES movie(code),

  FOREIGN KEY (director_code)
    REFERENCES director(code)
);

CREATE TABLE movie_cast (
  movie_code INT UNSIGNED NOT NULL,
  actor_code INT UNSIGNED NOT NULL,
  type VARCHAR(10), -- 주연, 조연 등 타입
  role VARCHAR(50),
  role_en VARCHAR(50),

  PRIMARY KEY (movie_code, actor_code),

  FOREIGN KEY (movie_code)
    REFERENCES movie(code),
  
  FOREIGN KEY (actor_code)
    REFERENCES actor(code)
);

CREATE TABLE director (
  code INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50),
  name_en VARCHAR(50),

  PRIMARY KEY (code)
);

CREATE TABLE actor (
  code INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50),
  name_en VARCHAR(50),

  PRIMARY KEY (code)
);

CREATE TABLE user (
  email VARCHAR(100) NOT NULL,
  name VARCHAR(50) NOT NULL,
  password VARCHAR(100) NOT NULL,
  age TINYINT UNSIGNED NOT NULL,
  grade VARCHAR(10) DEFAULT 'C' NOT NULL,
  mileage INT UNSIGNED DEFAULT 0 NOT NULL,
  acc_mileage INT UNSIGNED DEFAULT 0 NOT NULL, -- 누적 마일리지 (accumulative mileage)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,

  PRIMARY KEY (email)
);

CREATE TABLE screen_schedule(
   code INT UNSIGNED NOT NULL AUTO_INCREMENT,
   screen_id INT UNSIGNED NOT NULL,
   start_time DATETIME,
   fin_time DATETIME,
   movie_id INT UNSIGNED NOT NULL,
   date DATETIME,

   PRIMARY KEY(code),

   FOREIGN KEY(movie_id)
      REFERENCES movie(code),

   FOREIGN KEY(screen_id) 
      REFERENCES screen(screen_code)
);

CREATE TABLE evaluation(
   code INT UNSIGNED NOT NULL AUTO_INCREMENT,
   user_id VARCHAR(100) NOT NULL,
   movie_id INT UNSIGNED NOT NULL,
   star TINYINT UNSIGNED NOT NULL,
   line_eval VARCHAR(200),
   movie_check VARCHAR(10) NOT NULL,
   
   PRIMARY KEY(code),

   FOREIGN KEY(movie_id)
      REFERENCES movie(code),

   FOREIGN KEY(user_id)
      REFERENCES user(email)
);

CREATE TABLE coupon(
   code INT UNSIGNED NOT NULL AUTO_INCREMENT,
   name VARCHAR(100),
   discount INT(100),
   user_id VARCHAR(100) NOT NULL,
   apply VARCHAR(100),
   enabled VARCHAR(100),

   PRIMARY KEY(code),

   FOREIGN KEY(user_id)
      REFERENCES user(email)
);

CREATE TABLE reservation(
   code INT UNSIGNED NOT NULL AUTO_INCREMENT,
   screen_sche  INT UNSIGNED NOT NULL,
   screen_id    INT UNSIGNED NOT NULL,
   seat_num VARCHAR(10) NOT NULL,
   user_id VARCHAR(100) NOT NULL,

   PRIMARY KEY(code),
   
   FOREIGN KEY(screen_sche)
      REFERENCES screen_schedule(code),

   FOREIGN KEY(user_id)
      REFERENCES user(email),

   FOREIGN KEY(screen_id)
      REFERENCES screen(screen_code)
);

ALTER TABLE reservation ADD
   FOREIGN KEY(seat_num)
      REFERENCES seat(seat_num);