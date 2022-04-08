const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class lessonTeachers extends Model {}

  lessonTeachers.init({
    lesson_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'lessonTeachers',
    tableName: 'lesson_teachers',
  });
  return lessonTeachers;
};
