/*  eslint mocha/no-mocha-arrows: 0 */

const request = require('supertest');
const { expect } = require('chai');
const { Op } = require('sequelize');
const getApp = require('../server/index.js');
const db = require('../db/models');

describe('test root', () => {
  let app;

  before((done) => {
    app = getApp();
    db.sequelize.authenticate().then(() => done()).catch((e) => done(e));
  });

  it('Positive case: GET /lessons with lessonsCount', async () => {
    const params = {
      title: 'Blue Ocean',
      teacherIds: [1, 4],
      firstDate: '2022-04-19',
      days: [0, 1, 6],
      lessonsCount: 1,
    };

    const lessonIds = await request(app)
      .post('/lessons')
      .send(params)
      .expect(200)
      .expect('content-type', /json/);

    const lessons = await db.Lesson.findAll({
      attributes: ['id', 'title', 'date', 'status'],
      where: { id: { [Op.eq]: lessonIds.body } },
      include: {
        attributes: ['id'],
        model: db.Teacher,
        as: 'teachers',
      },
    });
    expect(lessons).to.be.an('array').and.lengthOf(1);
    expect(lessons[0]).to.include({ title: params.title, status: 0, date: '2022-04-23' });
    const { teachers } = lessons[0];
    expect(teachers[0].lessonTeachers).to.include({
      lesson_id: lessons[0].id, teacher_id: params.teacherIds[0],
    });
    expect(teachers[1].lessonTeachers).to.include({
      lesson_id: lessons[0].id, teacher_id: params.teacherIds[1],
    });
  });

  it('Positive case: GET /lessons with lastDate', async () => {
    const params = {
      title: 'Blue Ocean',
      teacherIds: [2, 3],
      firstDate: '2022-05-01',
      days: [0],
      lastDate: '2022-05-29',
    };

    const lessonIds = await request(app)
      .post('/lessons')
      .send(params)
      .expect(200)
      .expect('content-type', /json/);
    const lessons = await db.Lesson.findAll({
      attributes: ['date'],
      where: { id: { [Op.in]: lessonIds.body } },
      raw: true,
    });
    expect(lessons).to.be.an('array').and.lengthOf(5);
    lessons.forEach(({ date }) => expect(date).to.be.oneOf([
      '2022-05-01',
      '2022-05-08',
      '2022-05-15',
      '2022-05-22',
      '2022-05-29',
    ]));
  });

  it('Negative case: GET /lessons', (done) => {
    const params = {
      title: 'Blue Ocean',
      teacherIds: [1, 4],
      firstDate: '2022-04-19',
      days: [0, 7],
      lessonsCount: 0,
    };

    request(app)
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
