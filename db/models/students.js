const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      Student.belongsToMany(models.Lesson, { through: models.Lesson_students });
    }
  }
  Student.init({
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
    modelName: 'Student',
    tableName: 'students',
  });
  return Student;
};
