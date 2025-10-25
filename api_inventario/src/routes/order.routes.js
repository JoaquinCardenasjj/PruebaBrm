const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { createOrder, getMyOrders, getAllOrders, getOrderById } = require('../controllers/order.controller');



router.post(
    '/',
    verifyToken,
    [
      body('items')
        .isArray({ min: 1 })
        .withMessage('Debe enviar al menos un producto en items'),
      body('items.*.productId')
        .isInt({ gt: 0 })
        .withMessage('El productId de cada item debe ser un número entero válido'),
      body('items.*.quantity')
        .isInt({ gt: 0 })
        .withMessage('La cantidad debe ser un número entero mayor que 0')
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    createOrder
  );
  

router.get('/my-orders', verifyToken, getMyOrders);
router.get('/', verifyToken, isAdmin, getAllOrders);

router.get(
    "/:id",
    verifyToken,
    [param("id").isInt().withMessage("El ID debe ser un número entero")],
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    getOrderById
  );

module.exports = router;
