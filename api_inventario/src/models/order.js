const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('PENDIENTE', 'COMPLETADA', 'CANCELADA'),
    defaultValue: 'PENDIENTE'
  }
}, {
  tableName: 'orders',
  timestamps: true
});

Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order;
