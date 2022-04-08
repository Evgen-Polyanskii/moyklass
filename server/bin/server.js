#! /usr/bin/env node
const getApp = require('../index.js');

const port = process.env.PORT || 4000;

getApp().listen(port, () => {
  console.log(`Server was started on '${port}'`);
});
