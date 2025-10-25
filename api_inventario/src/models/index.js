const Order = require('./order');
const OrderItem = require('./orderItem');
const Product = require('./product');
const User = require('./user');
const sequelize = require('../config/database');

// Asociaciones
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  Order,
  OrderItem,
  Product,
  User,
  sequelize
};
