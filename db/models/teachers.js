const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      Teacher.belongsToMany(models.Lesson, { through: models.Lesson_teachers });
    }
  }
  Teacher.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING(10),
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Teacher',
    tableName: 'teachers',
  });
  return Teacher;
};
