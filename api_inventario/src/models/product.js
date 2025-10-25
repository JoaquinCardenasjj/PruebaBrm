const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  numero_lote: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  cantidad_disponible: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_ingreso: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = Product;
