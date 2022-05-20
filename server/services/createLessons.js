const models = require('../../db/models');
const LessonRepositories = require('../repositories/LessonRepositories.js');
const createLessons = require('../helpers/createLessons.js');

module.exports = async (params) => {
  const lessonRepositories = new LessonRepositories(models);
  const { teacherIds, ...otherParams } = params;
  const newLessons = createLessons(otherParams);
  return lessonRepositories.createLessons(newLessons, teacherIds);
};
