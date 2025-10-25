const Order = require('./order');
const OrderItem = require('./orderItem');
const Product = require('./product');
const User = require('./user');

// Relación: un usuario tiene muchas órdenes
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Relación: una orden tiene muchos items
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Relación: un producto puede estar en muchos items
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { Order, OrderItem, Product, User };
