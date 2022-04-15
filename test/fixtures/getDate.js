const { faker } = require('@faker-js/faker');

const getTeacher = () => ({
  name: faker.name.firstName(),
});

const getStudents = () => ({
  name: faker.name.firstName(),
});

const getLessons = () => ({
  date: faker.date.between('2019-01-01', '2020-01-01'),
  title: faker.lorem.words(2),
  status: faker.datatype.number({ min: 0, max: 1 }),
});

module.exports = { getTeacher, getStudents, getLessons };
