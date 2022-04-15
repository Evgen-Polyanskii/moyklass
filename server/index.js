require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const models = require('../db/models');
const addRoutes = require('./routes/index.js');

module.exports = () => {
  const app = express();
  app.set('models', models);
  app.use(bodyParser.json());
  addRoutes(app);
  return app;
};
