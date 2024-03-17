const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

exports.sign = (email, name, admin = "") => {
  let payload = {
    email: email,
    name: name
  };
  if (admin) payload.admin = admin;
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwtConfig.secretKey,
      { // JWT Option
        // algorithm: jwtConfig.algorithm,
        expiresIn: jwtConfig.expiresIn
      }, (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
};

exports.verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      jwtConfig.secretKey,
      // {
      //   algorithms: [jwtConfig.algorithm]
      // },
      (error, decoded) => {
        if (error) reject(error);
        resolve(decoded);
      }
    );
  });
};