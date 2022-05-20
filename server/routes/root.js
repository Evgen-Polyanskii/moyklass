const _ = require('lodash');
const validate = require('../helpers/validators/rootQueryValidator.js');
const getLessons = require('../services/getLessons.js');

module.exports = (app) => {
  app
    .get('/', async (req, res, next) => {
      try {
        const errors = validate(req.query);
        if (!_.isEmpty(errors)) {
          res.status(400).json({ errors });
          return;
        }

        const lessons = await getLessons(req.query);
        res.set('Content-Type', 'application/json')
          .status(200)
          .json(lessons);
      } catch (err) {
        next(err);
      }
    });
};
