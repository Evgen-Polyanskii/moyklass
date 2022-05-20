const { Op, literal } = require('sequelize');
const _ = require('lodash');

module.exports = (params, defaultQuery) => {
  const filterKeys = {
    date: (query, dates) => {
      const newQuery = _.cloneDeep(query);
      const arrayOfDate = dates.split(',').map((date) => new Date(date.trim()));
      newQuery.where.date = arrayOfDate.length === 1
        ? arrayOfDate[0] : { [Op.between]: arrayOfDate.sort() };
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
      newQuery.where.teacher_id = { [Op.in]: arrayOfIds };
      return newQuery;
    },
    studentsCount: (query, count) => {
      const newQuery = _.cloneDeep(query);
      const arrayOfCount = count.split(',');
      const having = arrayOfCount.length > 1
        ? `BETWEEN ${arrayOfCount[0]} AND ${arrayOfCount[1]}` : `= ${arrayOfCount[0]}`;
      newQuery.having = literal(`COUNT(*) ${having}`);
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
    .reduce((query, [key, value]) => {
      if (_.isUndefined(value)) return query;
      return filterKeys[key](query, value);
    }, defaultQuery);
};
