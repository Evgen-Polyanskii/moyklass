const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsToMany(models.Teacher, { through: models.Lesson_teachers });
      Lesson.belongsToMany(models.Student, { through: models.Lesson_students });
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
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Lesson',
    tableName: 'lessons',
  });
  return Lesson;
};
