const _ = require('lodash');
const validate = require('../helpers/validators/postLessonsValidator.js');
const createLessons = require('../services/createLessons.js');

const resource = '/lessons';

module.exports = (app) => {
  app
    .post(resource, async (req, res) => {
      try {
        const errors = validate(req.body);
        if (!_.isEmpty(errors)) {
          res.status(400).json(errors);
          return;
        }

        const lessonIds = await createLessons(req.body);
        res.set('Content-Type', 'application/json')
          .status(200)
          .json(lessonIds);
      } catch (e) {
        res.send(500, 'Something went wrong, please try again');
      }
    });
};
