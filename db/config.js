const dotenv = require('dotenv');
const path = require('path');

const pathToEnv = path.resolve(__dirname, '../.env');

dotenv.config({ path: pathToEnv });

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres',
  },
  test: {
    database: ':memory:',
    port: 5000,
    dialect: 'SQL',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres',
  },
};
