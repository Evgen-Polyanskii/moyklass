const { literal } = require('sequelize');
const parseFilters = require('../helpers/parseFilters.js');
const createLessons = require('../helpers/createLessons.js');

class LessonRepositories {
  constructor(app) {
    this.models = app.get('models');
  }

  async getAll(params) {
    const defaultQuery = {
      attributes: {
        include: [
          [literal(`(SELECT COUNT("visit") FROM "lesson_students" 
          WHERE "lesson_id" = "Lesson"."id" AND "visit" = true)`), 'visitCount'],
        ],
      },
      where: {},
      include: [
        {
          model: this.models.Teacher,
          as: 'teachers',
          through: {
            attributes: [],
          },
          require: true,
        },
        {
          model: this.models.Student,
          as: 'students',
          through: {
            attributes: ['visit'],
          },
          require: true,
        },
      ],
      limit: 5,
      offset: 0,
    };

    const query = parseFilters(params, defaultQuery);
    return this.models.Lesson.findAll(query);
  }

  async createLessons(params) {
    const t = await this.models.sequelize.transaction();
    try {
      const { teacherIds, ...otherParams } = params;
      const newLessons = createLessons(otherParams);
      const lessons = await this.models.Lesson.bulkCreate(newLessons, { transaction: t });
      const lessonsIds = await Promise.all(lessons.map(async (lesson) => {
        await lesson.setTeachers(teacherIds, { transaction: t });
        return lesson.id;
      }));
      await t.commit();
      return lessonsIds;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }
}

module.exports = LessonRepositories;
