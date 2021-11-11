'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart_Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Cart_Item.init({
    product_id: DataTypes.INTEGER,
    cart_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Cart_Item',
  });
  Cart_Item.associate = (models) => {
    Cart_Item.belongsTo(models.Cart, {
      foreignKey: "cart_id",
      onDelete: "CASCADE"
    });
    Cart_Item.belongsTo(models.Product, {
      foreignKey: "product_id",
      onDelete: "CASCADE"
    });
  }
  return Cart_Item;
};