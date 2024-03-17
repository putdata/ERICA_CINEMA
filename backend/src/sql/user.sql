CREATE TABLE user (
  email VARCHAR(100) NOT NULL,
  name VARCHAR(50) NOT NULL,
  password VARCHAR(100) NOT NULL,
  age TINYINT UNSIGNED NOT NULL,
  grade VARCHAR(10) DEFAULT 'BRONZE' NOT NULL,
  mileage INT UNSIGNED DEFAULT 0 NOT NULL,
  acc_mileage INT UNSIGNED DEFAULT 0 NOT NULL, -- 누적 마일리지 (accumulative mileage)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,

  PRIMARY KEY (email)
);

CREATE TABLE admin (
  email VARCHAR(100) NOT NULL,
  type VARCHAR(10) NOT NULL,

  PRIMARY KEY (email),

  FOREIGN KEY (email)
    REFERENCES user(email)
);

CREATE TABLE payment (
  email VARCHAR(100) NOT NULL,
  time DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  price INT NOT NULL,
  type VARCHAR(20) NOT NULL,
  serial_number VARCHAR(100) NOT NULL,

  PRIMARY KEY (email, time)
);


INSERT INTO user (email, name, password, age)
VALUES ('test@test.com', '테스트', 'test', 21);

INSERT INTO admin VALUES ('test@test.com', 'ADMIN');