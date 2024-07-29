'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Presence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Presence.belongsTo(models.User, { foreignKey: 'userId', onDelete: "CASCADE" });
    }
  }
  Presence.init({
    presenceDate: DataTypes.DATE,
    checkIn: DataTypes.DATE,
    checkOut: DataTypes.DATE,
    overtime: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: ['LATE', 'ONTIME', 'LEAVE']
    },
  }, {
    sequelize,
    modelName: 'Presence',
  });
  return Presence;
};