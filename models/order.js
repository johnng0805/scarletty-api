'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Order.init({
    user_id: DataTypes.INTEGER,
    total: DataTypes.DECIMAL,
    payment_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: "user_id"
    });
    Order.hasMany(models.Order_Item, {
      onDelete: "cascade"
    });
    Order.hasOne(models.Payment_Info, {
      foreignKey: "payment_id"
    });
  }
  return Order;
};