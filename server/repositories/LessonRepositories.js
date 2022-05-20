const { Op } = require('sequelize');
const parseFilters = require('../helpers/parseFilters.js');

class LessonRepositories {
  constructor(models) {
    this.models = models;
  }

  async getAll(lessonIds, params) {
    const defaultQuery = {
      where: {
        id: { [Op.in]: lessonIds },
      },
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
    };

    const query = parseFilters(params, defaultQuery);
    return this.models.Lesson.findAll(query);
  }

  async getLessons(params, attributes) {
    const defaultQuery = {
      attributes,
      where: {},
      raw: true,
    };

    const query = parseFilters(params, defaultQuery);
    return this.models.Lesson.findAll(query);
  }

  async getLessonsWithRequiredTeachers(params, lessonsIds) {
    const defaultQuery = {
      attributes: ['lesson_id'],
      where: {
        lesson_id: {
          [Op.in]: lessonsIds,
        },
      },
      raw: true,
    };

    const query = parseFilters(params, defaultQuery);
    return this.models.lessonTeachers.findAll(query);
  }

  async getLessonsWithRequiredCountStudents(params, lessonsIds) {
    const defaultQuery = {
      attributes: ['lesson_id'],
      where: {
        lesson_id: {
          [Op.in]: lessonsIds,
        },
      },
      group: ['lesson_id'],
      raw: true,
    };

    const query = parseFilters(params, defaultQuery);
    return this.models.lessonStudents.findAll(query);
  }

  async createLessons(lessonList, teacherIds) {
    const t = await this.models.sequelize.transaction();
    try {
      const lessons = await this.models.Lesson
        .bulkCreate(lessonList, { validate: true, transaction: t });
      const lessonsIds = lessons.map(({ id }) => id);
      const lessonTeachers = lessonsIds.reduce((acc, lessonId) => {
        teacherIds.forEach((teacherId) => {
          acc.push({
            lesson_id: lessonId,
            teacher_id: teacherId,
          });
        });
        return acc;
      }, []);
      await this.models.lessonTeachers
        .bulkCreate(lessonTeachers, { validate: true, transaction: t });
      await t.commit();
      return lessonsIds;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }
}

module.exports = LessonRepositories;
