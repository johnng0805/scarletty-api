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
    Product.hasMany(models.Cart_Item);
    Product.hasMany(models.Order_Item);
    Product.belongsTo(models.Vendor, {
      foreignKey: "vendor_id",
      onDelete: "CASCADE"
    });
    Product.belongsToMany(models.Category, {
      foreignKey: "product_id",
      through: models.Product_Category
    });
    Product.hasMany(models.Product_Image, {
      onDelete: "cascade"
    });
  }
  return Product;
};