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
        foreignKey: 'id'
      })
    }
  }
  JobRole.init({
    order: DataTypes.INTEGER,
    roleName: DataTypes.STRING,
    salary: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'JobRole',
  });
  return JobRole;
};