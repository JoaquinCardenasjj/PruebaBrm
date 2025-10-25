const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./product');
const Order = require('./order');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'orderitems',
  timestamps: true
});

// 🔗 Asociaciones correctas
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

module.exports = OrderItem;
