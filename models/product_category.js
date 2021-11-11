'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Product_Category.init({
    product_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product_Category',
  });
  // Product_Category.associate = (models) => {
  //   Product_Category.hasMany(models.Product, {
  //     foreignKey: "product_id"
  //   });
  //   Product_Category.hasMany(models.Category, {
  //     foreignKey: "category_id"
  //   });
  // }
  return Product_Category;
};