require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const addRoutes = require('./routes/index.js');

module.exports = () => {
  const app = express();
  app.use(bodyParser.json());
  addRoutes(app);
  return app;
};
