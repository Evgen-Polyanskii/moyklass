/*  eslint mocha/no-mocha-arrows: 0 */
process.env.NODE_ENV = 'test';

const request = require('supertest');
const { expect } = require('chai');
const getApp = require('../server/index.js');
const db = require('../db/models');
const fixtures = require('./fixtures/index.js');

describe('test root', () => {
  before((done) => {
    this.app = getApp();
    db.sequelize.authenticate()
      .then(() => db.sequelize.sync({ force: true, logging: false }))
      .then(() => db.Student.bulkCreate(fixtures.getStudentsData()))
      .then(() => db.Teacher.bulkCreate(fixtures.getTeachersData()))
      .then(() => db.Lesson.bulkCreate(fixtures.getLessonsData()))
      .then(() => db.lessonTeachers.bulkCreate(fixtures.getLessonTeachersData()))
      .then(() => db.lessonStudents.bulkCreate(fixtures.getLessonStudentsData()))
      .then(() => done())
      .catch((e) => done(e));
  });

  it('Positive case: GET /', (done) => {
    request(this.app)
      .get('/')
      .expect(200)
      .expect('content-type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array').and.lengthOf(5);
        return done();
      });
  });

  it('Positive case: GET / with params', (done) => {
    const params = {
      teacherIds: '1',
      status: 1,
      studentsCount: '3,4',
    };
    request(this.app)
      .get('/')
      .query(params)
      .expect(200)
      .expect('content-type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array').and.lengthOf(2);
        res.body.forEach((lesson) => expect(lesson)
          .to.have.keys('status', 'id', 'visitCount', 'title', 'date', 'students', 'teachers'));
        res.body.forEach(({ id }) => expect(id).to.be.oneOf([1, 2]));
        res.body[0].teachers.forEach(({ id }) => expect(id).to.be.oneOf([1, 3]));
        res.body.forEach(({ status }) => expect(status).to.be.equal(1));
        expect(res.body[0].students).to.have.lengthOf(4);
        expect(res.body[1].students).to.have.lengthOf(3);
        return done();
      });
  });

  it('Positive case: GET / with data', (done) => {
    const params = {
      date: '2022-09-02',
    };

    const expected = {
      id: 10,
      date: '2022-09-02T00:00:00.000Z',
      title: 'Purple Color',
      status: 0,
      teachers: [{ id: 3, name: 'Angelina' }],
      students: [],
      visitCount: 0,
    };

    request(this.app)
      .get('/')
      .query(params)
      .expect(200)
      .expect('content-type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array').and.lengthOf(1);
        expect(res.body[0]).to.be.deep.equal(expected);
        return done();
      });
  });

  it('Negative case: GET /', (done) => {
    const params = {
      date: '2021-01-01,2021-14-12',
      status: 2,
      studentsCount: 'as',
      lessonsPerPage: 1,
    };
    request(this.app)
      .get('/')
      .query(params)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors).to.be.an('array').and.lengthOf(3);
        res.body.errors.forEach((e) => expect(e).to.have.any.keys('date', 'status', 'studentsCount'));
        return done();
      });
  });
});
