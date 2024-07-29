'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Presence, { foreignKey: 'userId' });
      User.hasMany(models.Payslip, { foreignKey: 'userId' });
      User.belongsTo(models.JobRole, { foreignKey: 'roleId' });
      User.hasMany(models.Notification, { foreignKey: 'userId' });
      User.hasMany(models.LeaveRequest, { foreignKey: 'userId' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    encryptedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: DataTypes.STRING,
    image: DataTypes.STRING,
    address: DataTypes.STRING,
    privilege: DataTypes.ENUM('ROOT', 'ADMIN', 'MEMBER'),
    roleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};