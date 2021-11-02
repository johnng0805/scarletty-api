'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment_Info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Payment_Info.init({
    user_id: DataTypes.INTEGER,
    type: DataTypes.ENUM("Visa", "Cash"),
    provider: DataTypes.STRING,
    account_no: DataTypes.STRING,
    expiry: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Payment_Info',
  });
  Payment_Info.associate = (models) => {
    Payment_Info.belongsTo(models.User, {
      foreignKey: "user_id"
    });
    Payment_Info.hasMany(models.Order);
  }
  return Payment_Info;
};