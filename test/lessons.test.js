/*  eslint mocha/no-mocha-arrows: 0 */
process.env.NODE_ENV = 'test';

const request = require('supertest');
const { expect } = require('chai');
const { Op } = require('sequelize');
const getApp = require('../server/index.js');
const fixtures = require('./fixtures/index.js');
const db = require('../db/models');

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

  it('Positive case: POST /lessons with lessonsCount', async () => {
    const params = {
      title: 'Blue Ocean',
      teacherIds: [1],
      firstDate: '2022-04-19',
      days: [0],
      lessonsCount: 2,
    };

    const lessonIds = await request(this.app)
      .post('/lessons')
      .send(params)
      .expect(200)
      .expect('content-type', /json/);

    console.log('lessonIds', lessonIds.body);
    const lessons = await db.Lesson.findAll({
      attributes: ['title', 'date', 'status'],
      where: { id: { [Op.in]: lessonIds.body } },
      include: {
        attributes: ['id'],
        model: db.Teacher,
        as: 'teachers',
      },
      order: ['date'],
    });
    console.log(lessons);
    expect(lessons).to.be.an('array').and.lengthOf(2);
    expect(lessons[0].date.toISOString()).to.equal('2022-04-24T00:00:00.000Z');
    expect(lessons[1].date.toISOString()).to.equal('2022-05-01T00:00:00.000Z');
    lessons.forEach(({ status }) => expect(status).to.be.equal(0));
    console.log(lessons[0].teachers);
    const { teachers } = lessons[0];
    expect(teachers[0].id).to.equal(1);
    expect(teachers[0].lessonTeachers).to.include({
      lesson_id: lessonIds.body[0], teacher_id: params.teacherIds[0],
    });
  });

  it('Positive case: POST /lessons with lastDate', async () => {
    const params = {
      title: 'Blue Ocean',
      teacherIds: [1, 2],
      firstDate: '2022-03-31',
      days: [4, 2],
      lastDate: '2022-04-06',
    };

    const lessonIds = await request(this.app)
      .post('/lessons')
      .send(params)
      .expect(200)
      .expect('content-type', /json/);

    const lessons = await db.Lesson.findAll({
      attributes: ['title', 'date', 'status'],
      where: { id: { [Op.in]: lessonIds.body } },
      include: {
        attributes: ['id'],
        model: db.Teacher,
        as: 'teachers',
      },
      order: ['date'],
    });

    expect(lessons).to.be.an('array').and.lengthOf(2);
    expect(lessons[0].date.toISOString()).to.equal('2022-03-31T00:00:00.000Z');
    expect(lessons[1].date.toISOString()).to.equal('2022-04-05T00:00:00.000Z');
    lessons.forEach(({ title }) => expect(title).to.equal('Blue Ocean'));
    expect(lessons[0].teachers).to.be.an('array').and.lengthOf(2);
    expect(lessons[1].teachers).to.be.an('array').and.lengthOf(2);
  });

  it('Negative case: POST /lessons', (done) => {
    const params = {
      title: 'Blue Ocean',
      teacherIds: [1, 4],
      firstDate: '2022-04-19',
      days: [0, 7],
      lessonsCount: 0,
    };

    request(this.app)
      .post('/lessons')
      .send(params)
      .expect(400)
      .expect('content-type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array').and.lengthOf(2);
        return done();
      });
  });
});
