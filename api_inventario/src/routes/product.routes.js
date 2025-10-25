const express = require('express');
const router = express.Router();
const { crearProducto, obtenerProductos, actualizarProducto, eliminarProducto } = require('../controllers/product.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Solo ADMIN puede crear, actualizar y eliminar productos
router.post('/', verifyToken, isAdmin, crearProducto);
router.get('/', verifyToken, obtenerProductos);
router.put('/:id', verifyToken, isAdmin, actualizarProducto);
router.delete('/:id', verifyToken, isAdmin, eliminarProducto);

module.exports = router;
