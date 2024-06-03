'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LeaveRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LeaveRequest.init({
    userId: DataTypes.INTEGER,
    requestDate: DataTypes.DATE,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM,
      values: ['LATE', 'ONTIME', 'LEAVE']
    },
  }, {
    sequelize,
    modelName: 'LeaveRequest',
  });
  return LeaveRequest;
};