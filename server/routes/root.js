/* eslint camelcase: 0 */

const _ = require('lodash');
const LessonRepositories = require('../repositories/LessonRepositories.js');
const validate = require('../helpers/validators/rootQueryValidator.js');

module.exports = (app) => {
  app
    .get('/', async (req, res) => {
      try {
        const errors = validate(req.body);
        if (!_.isEmpty(errors)) {
          res.status(400).json(errors);
          return;
        }

        const lessonRepositories = new LessonRepositories(app);
        const lessons = await lessonRepositories.getAll(req.body);

        const lessonsList = lessons.map(({ dataValues: lesson }) => {
          const students = lesson.students.map(({ dataValues: student }) => ({
            id: student.id,
            name: student.name,
            visit: student.lessonStudents.visit,
          }));
          return { ...lesson, students };
        });
        res.set('Content-Type', 'application/json');
        res.json(lessonsList);
      } catch (e) {
        res.status(500).json('Something went wrong, please try again');
        throw e;
      }
    });
};
