'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      JobRole.hasMany(models.User, {
        foreignKey: 'roleId',
        onDelete: "CASCADE"
      })
    }
  }
  JobRole.init({
    order: DataTypes.INTEGER,
    roleName: DataTypes.STRING,
    salary: DataTypes.FLOAT,
    overtimeBonus: DataTypes.FLOAT,
    absenceDeduction: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'JobRole',
  });
  return JobRole;
};