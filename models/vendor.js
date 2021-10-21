'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Vendor.init({
    name: DataTypes.STRING,
    country: DataTypes.STRING,
    email: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Vendor',
  });
  Vendor.associate = (models) => {
    Vendor.hasMany(models.Product, {
      onDelete: "cascade"
    });
  }
  return Vendor;
};