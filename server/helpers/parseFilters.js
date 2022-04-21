const { Op, literal, where } = require('sequelize');
const _ = require('lodash');

module.exports = (params, defaultQuery) => {
  const filterKeys = {
    date: (query, date) => {
      const newQuery = _.cloneDeep(query);
      const arrayOfDate = date.split(',');
      newQuery.where.date = arrayOfDate.length === 1
        ? date : { [Op.between]: arrayOfDate };
      return newQuery;
    },
    status: (query, value) => {
      const newQuery = _.cloneDeep(query);
      newQuery.where.status = value;
      return newQuery;
    },
    teacherIds: (query, ids) => {
      const newQuery = _.cloneDeep(query);
      const arrayOfIds = ids.split(',');
      newQuery.include[0].where = arrayOfIds.length === 1
        ? { id: arrayOfIds[0] } : { id: { [Op.in]: arrayOfIds } };
      return newQuery;
    },
    studentsCount: (query, count) => {
      const newQuery = _.cloneDeep(query);
      const arrayOfCount = count.split(',');
      newQuery.where = where(
        literal('(SELECT COUNT("student_id") FROM "lesson_students" WHERE "lesson_id" = "Lesson"."id")'),
        (arrayOfCount.length === 1) ? { [Op.eq]: arrayOfCount[0] } : { [Op.between]: arrayOfCount },
      );
      return newQuery;
    },
    lessonsPerPage: (query, value) => {
      const newQuery = _.cloneDeep(query);
      newQuery.limit = value;
      return newQuery;
    },
    page: (query, value) => {
      const newQuery = _.cloneDeep(query);
      newQuery.offset = (params.lessonsPerPage ?? 5) * (value - 1);
      return newQuery;
    },
  };

  return Object.entries(params)
    .reduce((query, [key, value]) => filterKeys[key](query, value), defaultQuery);
};
