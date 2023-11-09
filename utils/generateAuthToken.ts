const jwt = require('jsonwebtoken');

const generateAccessToken = (data: any, secrete: string) => {
  const token = jwt.sign({ data }, secrete, {
    expiresIn: '15m',
  });
  return token;
};

const generateRefreshToken = (data: any, secrete: string) => {
  const token = jwt.sign({ data }, secrete);
  return token;
};

module.exports = { generateAccessToken, generateRefreshToken };
