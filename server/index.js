const dotenv = require('dotenv');
const express = require('express');
const addRoutes = require('./routes/index.js');

dotenv.config();

module.exports = () => {
  const app = express();
  addRoutes(app);
  return app;
};
