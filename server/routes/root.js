/* eslint camelcase: 0 */

const _ = require('lodash');
const LessonRepositories = require('../repositories/LessonRepositories.js');
const validate = require('../helpers/validator.js');

module.exports = (app) => {
  app
    .get('/', async (req, res) => {
      try {
        const errors = validate(req.body);
        if (!_.isEmpty(errors)) {
          res.status(400).json(errors);
          return;
        }

        const { studentsCount, ...otherParams } = req.body;
        const lessonRepositories = new LessonRepositories(app);

        const lessonsList = await lessonRepositories.getAll(otherParams);
        const requiredLessons = [];

        if (studentsCount) {
          const lessonsId = lessonsList.map(({ id }) => id);
          const lessonsWithRequiredNumOfStudents = await lessonRepositories
            .getStudentCount(studentsCount, lessonsId);
          const idLesWithRequireNumOfStudents = lessonsWithRequiredNumOfStudents
            .map(({ lesson_id }) => lesson_id);
          lessonsList.forEach(({ dataValues: lesson }) => {
            const isRequiredNumberOfStudents = idLesWithRequireNumOfStudents.includes(lesson.id);
            if (isRequiredNumberOfStudents) {
              const visitStudents = lesson.students
                .filter(({ lessonStudents }) => lessonStudents.visit);
              const visitCount = visitStudents.length;
              const students = lesson.students.map(({ dataValues: student }) => {
                const isVisit = student.lessonStudents.visit;
                return { id: student.id, name: student.name, visit: isVisit };
              });
              requiredLessons.push({ ...lesson, visitCount, students });
            }
          });
        } else {
          lessonsList.forEach(({ dataValues: lesson }) => {
            const visitStudents = lesson.students
              .filter(({ lessonStudents }) => lessonStudents.visit);
            const visitCount = visitStudents.length;
            const students = lesson.students.map(({ dataValues: student }) => {
              const isVisit = student.lessonStudents.visit;
              return { id: student.id, name: student.name, visit: isVisit };
            });
            requiredLessons.push({ ...lesson, visitCount, students });
          });
        }

        res.set('Content-Type', 'application/json');
        console.log('requiredLessons', JSON.stringify(requiredLessons, null, 2));
        res.json(requiredLessons);
      } catch (e) {
        res.status(500).json('Something went wrong, please try again');
        throw e;
      }
    });
};
