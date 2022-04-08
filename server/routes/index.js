const root = require('./root.js');
const lessons = require('./lessons.js');

const controllers = [root, lessons];

module.exports = (app) => controllers.forEach((f) => f(app));
