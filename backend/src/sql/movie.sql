CREATE TABLE movie (
  code VARCHAR(20) NOT NULL,
  title VARCHAR(100),
  title_en VARCHAR(100),
  run_time SMALLINT,
  product_year VARCHAR(10), -- 제작년도
  nation VARCHAR(50), -- 제작국가
  open VARCHAR(10), -- 개봉일
  synopsis TEXT, -- 줄거리
  watch_grade VARCHAR(30),
  thumbnail VARCHAR(200),
  cumulative INT,
  book_rate DECIMAL(4, 1),
  score_rate DECIMAL(3, 1),
  show_status BOOLEAN DEFAULT 0 NOT NULL,

  PRIMARY KEY (code)
);

alter table movie add cumulative INT;
alter table movie add score_rate DECIMAL(3, 1);
alter table movie add book_rate DECIMAL(3, 1);

CREATE TABLE movie_stillcut (
  movie_code VARCHAR(20) NOT NULL,
  id TINYINT UNSIGNED NOT NULL,
  is_external BOOLEAN DEFAULT 0 NOT NULL,
  img VARCHAR(1000),

  PRIMARY KEY (movie_code, id),

  FOREIGN KEY (movie_code)
    REFERENCES movie(code)
);

CREATE TABLE genre (
  code TINYINT UNSIGNED NOT NULL,
  name VARCHAR(50),

  PRIMARY KEY (code)
);

CREATE TABLE movie_genre (
  movie_code VARCHAR(20) NOT NULL,
  genre_code TINYINT UNSIGNED NOT NULL,

  PRIMARY KEY (movie_code, genre_code),

  FOREIGN KEY (movie_code)
    REFERENCES movie(code),

  FOREIGN KEY (genre_code)
    REFERENCES genre(code)
);

CREATE TABLE movie_showtype (
  movie_code VARCHAR(20) NOT NULL,
  type VARCHAR(10) NOT NULL, -- film, 2d, 3d, 4d, imax 등등

  PRIMARY KEY (movie_code, type),

  FOREIGN KEY (movie_code)
    REFERENCES movie(code)
);

CREATE TABLE movie_director (
  movie_code VARCHAR(20) NOT NULL,
  name VARCHAR(50),

  PRIMARY KEY (movie_code, name),

  FOREIGN KEY (movie_code)
    REFERENCES movie(code)
);

CREATE TABLE movie_actor (
  movie_code VARCHAR(20) NOT NULL,
  name VARCHAR(50),

  PRIMARY KEY (movie_code, actor_code),

  FOREIGN KEY (movie_code)
    REFERENCES movie(code),
);




INSERT INTO genre VALUES (1, "애니메이션");
INSERT INTO genre VALUES (2, "SF");
INSERT INTO genre VALUES (3, "가족");
INSERT INTO genre VALUES (4, "공포");
INSERT INTO genre VALUES (5, "다큐멘터리");
INSERT INTO genre VALUES (6, "로맨스");
INSERT INTO genre VALUES (7, "로맨스코미디");
INSERT INTO genre VALUES (8, "모험");
INSERT INTO genre VALUES (9, "범죄");
INSERT INTO genre VALUES (10, "스포츠");
INSERT INTO genre VALUES (11, "역사");
INSERT INTO genre VALUES (12, "재난");
INSERT INTO genre VALUES (13, "코미디");
INSERT INTO genre VALUES (14, "판타지");








CREATE TABLE movie_service (
  movie_code VARCHAR(20) NOT NULL,
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