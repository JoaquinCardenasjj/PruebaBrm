require('./models/associations'); 
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Sincronizar BD
sequelize.sync({ alter: true })
  .then(() => console.log('Base de datos sincronizada correctamente'))
  .catch(err => console.error('Error al sincronizar BD:', err));

module.exports = app;
