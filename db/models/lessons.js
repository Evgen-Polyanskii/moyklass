const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsToMany(models.Teacher, { as: 'teachers', through: models.lessonTeachers, foreignKey: 'lesson_id' });
      Lesson.belongsToMany(models.Student, { as: 'students', through: models.lessonStudents, foreignKey: 'lesson_id' });
    }
  }
  Lesson.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    title: DataTypes.STRING(100),
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,

    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Lesson',
    tableName: 'lessons',
  });
  return Lesson;
};
