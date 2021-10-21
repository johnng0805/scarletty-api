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
    }
  };
  User.init({
    name: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    gender: DataTypes.ENUM("Male", "Female", "Other"),
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  User.associate = (models) => {
    User.hasOne(models.Billing_Info, {
      onDelete: "cascade"
    });
    User.hasMany(models.Payment_Info, {
      onDelete: "cascade"
    });
    User.hasOne(models.Cart, {
      onDelete: "cascade"
    });
  };
  return User;
};