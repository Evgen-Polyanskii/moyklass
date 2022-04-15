const { Op } = require('sequelize');
const parseFilters = require('../helpers/parseFilters.js');

class LessonRepositories {
  constructor(app) {
    this.models = app.get('models');
  }

  async getAll(params) {
    const defaultQuery = {
      where: {},
      limit: 5,
      offset: 0,
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

  async getStudentCount(studentsCount, lessonsId) {
    const defaultQuery = {
      attributes: [
        'lesson_id',
      ],
      where: {
        lesson_id: {
          [Op.in]: lessonsId,
        },
      },
      group: ['lesson_id'],
      raw: true,
    };

    const query = parseFilters({ studentsCount }, defaultQuery);
    return this.models.lessonStudents.findAll(query);
  }
}

module.exports = LessonRepositories;
