const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class lessonStudents extends Model {}

  lessonStudents.init({
    lesson_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER,
    visit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'lessonStudents',
    tableName: 'lesson_students',
  });
  return lessonStudents;
};
