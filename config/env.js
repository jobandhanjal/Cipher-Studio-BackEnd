require('dotenv').config();

const config = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/cipherstudio',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
};

module.exports = config;