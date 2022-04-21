const _ = require('lodash');
const validate = require('../helpers/validators/postLessonsValidator.js');
const LessonRepositories = require('../repositories/LessonRepositories.js');

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
        const lessonRepositories = new LessonRepositories(app);
        const lessonIds = await lessonRepositories.createLessons(req.body);
        res.set('Content-Type', 'application/json');
        res.json(lessonIds);
      } catch (e) {
        res.status(500).json('Something went wrong, please try again');
        throw e;
      }
    });
};
