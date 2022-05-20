/* eslint camelcase: 0 */

const _ = require('lodash');
const models = require('../../db/models');
const LessonRepositories = require('../repositories/LessonRepositories.js');

module.exports = async (params) => {
  const {
    studentsCount, teacherIds, date, status,
  } = params;
  const page = params.page || 1;
  const lessonsPerPage = params.lessonsPerPage || 5;
  const lessonRepositories = new LessonRepositories(models);

  const allLessons = await lessonRepositories.getLessons({ date, status }, ['id']);

  let lessonIds = allLessons.map(({ id }) => id);

  if (!_.isUndefined(teacherIds)) {
    const lessonsWithRequiredTeachers = await lessonRepositories
      .getLessonsWithRequiredTeachers({ teacherIds }, lessonIds);
    lessonIds = lessonsWithRequiredTeachers.map(({ lesson_id }) => lesson_id);
  }

  if (!_.isUndefined(studentsCount)) {
    const lessonsWithRequiredCountStudents = await lessonRepositories
      .getLessonsWithRequiredCountStudents({ studentsCount }, lessonIds);
    lessonIds = lessonsWithRequiredCountStudents.map(({ lesson_id }) => lesson_id);
  }

  const requiredLessons = await lessonRepositories.getAll(lessonIds, { lessonsPerPage, page });

  return requiredLessons.map(({ dataValues: lesson }) => {
    let visitCount = 0;
    const teachers = lesson.teachers.map(({ dataValues: teacher }) => teacher);
    const students = lesson.students.map(({ id, name, lessonStudents }) => {
      if (lessonStudents.visit) visitCount += 1;
      return { id, name, visit: lessonStudents.visit };
    });
    return {
      ...lesson, visitCount, teachers, students,
    };
  });
};
