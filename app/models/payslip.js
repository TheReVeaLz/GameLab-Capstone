'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payslip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payslip.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Payslip.init({
    periodStart: DataTypes.DATE,
    periodEnd: DataTypes.DATE,
    salary: DataTypes.FLOAT,
    allowances: DataTypes.FLOAT,
    deductions: DataTypes.FLOAT,
    netWorth: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Payslip',
  });
  return Payslip;
};