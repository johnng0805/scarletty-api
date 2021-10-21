'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Product.init({
    vendor_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    description: DataTypes.TEXT,
    discount: DataTypes.DECIMAL,
    in_stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  Product.associate = (models) => {
    Product.belongsTo(models.Cart_Item, {
      onDelete: "cascade"
    });
    Product.belongsTo(models.Order_Item, {
      onDelete: "cascade"
    });
    Product.belongsTo(models.Vendor);
    Product.belongsToMany(models.Product_Category);
    Product.hasMany(models.Product_Image, {
      onDelete: "cascade"
    });
  }
  return Product;
};