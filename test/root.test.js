/*  eslint mocha/no-mocha-arrows: 0 */

const request = require('supertest');
const { expect } = require('chai');
const getApp = require('../server/index.js');
const db = require('../db/models');

describe('test root', () => {
  let app;

  before((done) => {
    app = getApp();
    db.sequelize.authenticate().then(() => done()).catch((e) => done(e));
  });

  it('Positive case: GET /', (done) => {
    const params = {
      teacherIds: '1,2,3',
      status: 0,
      studentsCount: '2,3',
      lessonsPerPage: 1,
    };
    request(app)
      .get('/')
      .send(params)
      .expect(200)
      .expect('content-type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array').and.lengthOf(1);
        const lesson = res.body[0];
        expect(lesson).to.have.keys('status', 'id', 'visitCount', 'title', 'date', 'students', 'teachers');
        lesson.teachers.forEach(({ id }) => expect(id).to.be.oneOf([1, 2, 3]));
        expect(lesson.status).to.be.equal(0);
        expect(lesson.students).to.have.lengthOf.at.least(2);
        expect(lesson.students).to.have.lengthOf.at.most(3);
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
    request(app)
      .get('/')
      .send(params)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array').and.lengthOf(3);
        res.body.forEach((e) => expect(e).to.have.any.keys('date', 'status', 'studentsCount'));
        return done();
      });
  });
});
