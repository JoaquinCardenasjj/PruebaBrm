const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { createOrder, getMyOrders, getAllOrders, getOrderById } = require('../controllers/order.controller');


/**
 * @api {post} /api/orders Crear nueva orden
 * @apiName CrearOrden
 * @apiGroup Órdenes
 * @apiHeader {String} Authorization Token de acceso JWT.
 *
 * @apiBody {Object[]} items Lista de productos.
 * @apiBody {Number} items.productId ID del producto.
 * @apiBody {Number} items.quantity Cantidad de unidades a comprar.
 *
 * @apiSuccess {Number} id ID de la orden creada.
 * @apiSuccess {Number} total Total de la compra.
 * @apiSuccess {String} estado Estado de la orden.
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "id": 1,
 *   "total": 360000,
 *   "estado": "PENDIENTE",
 *   "OrderItems": [
 *      { "productId": 2, "quantity": 2, "subtotal": 240000 },
 *      { "productId": 3, "quantity": 1, "subtotal": 120000 }
 *   ]
 * }
 *
 * @apiError (400) BadRequest Error en la validación de los datos enviados.
 * @apiError (401) Unauthorized Token inválido o expirado.
 * @apiErrorExample {json} Error 400:
 * {
 *   "errors": [
 *     { "msg": "La cantidad debe ser un número entero mayor que 0" }
 *   ]
 * }
 */
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
  
/**
 * @api {get} /api/orders/my-orders Historial de órdenes del cliente
 * @apiName ObtenerMisOrdenes
 * @apiGroup Órdenes
 * @apiHeader {String} Authorization Token de acceso JWT.
 *
 * @apiDescription Retorna todas las órdenes realizadas por el cliente autenticado,
 * incluyendo los productos asociados a cada una.
 *
 * @apiSuccess {Number} id ID de la orden.
 * @apiSuccess {Number} total Total de la compra.
 * @apiSuccess {String} estado Estado actual de la orden ("PENDIENTE", "COMPLETADA", "CANCELADA").
 * @apiSuccess {Date} createdAt Fecha de creación de la orden.
 * @apiSuccess {Object[]} OrderItems Detalle de productos asociados a la orden.
 * @apiSuccess {Number} OrderItems.id ID del detalle.
 * @apiSuccess {Number} OrderItems.productId ID del producto.
 * @apiSuccess {Number} OrderItems.cantidad Cantidad comprada.
 * @apiSuccess {Number} OrderItems.precioUnitario Precio unitario del producto.
 * @apiSuccess {Object} OrderItems.Product Información del producto.
 * @apiSuccess {String} OrderItems.Product.nombre Nombre del producto.
 * @apiSuccess {Number} OrderItems.Product.precio Precio unitario del producto.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * [
 *   {
 *     "id": 1,
 *     "total": 360000,
 *     "estado": "PENDIENTE",
 *     "createdAt": "2025-10-24T22:29:08.000Z",
 *     "OrderItems": [
 *       {
 *         "id": 1,
 *         "productId": 2,
 *         "cantidad": 2,
 *         "precioUnitario": 120000,
 *         "Product": {
 *           "nombre": "Monitor Dell 24''",
 *           "precio": 120000
 *         }
 *       },
 *       {
 *         "id": 2,
 *         "productId": 3,
 *         "cantidad": 1,
 *         "precioUnitario": 120000,
 *         "Product": {
 *           "nombre": "Teclado Mecánico Logitech",
 *           "precio": 120000
 *         }
 *       }
 *     ]
 *   }
 * ]
 *
 * @apiError (401) Unauthorized Token inválido o expirado.
 * @apiError (500) ServerError Error al obtener las órdenes.
 * @apiErrorExample {json} Error 500:
 * {
 *   "message": "Error al obtener las órdenes SequelizeEagerLoadingError: ..."
 * }
 */
router.get('/my-orders', verifyToken, getMyOrders);
/**
 * @api {get} /api/orders Obtener todas las órdenes
 * @apiName GetAllOrders
 * @apiGroup Órdenes
 * @apiDescription Obtiene la lista completa de órdenes registradas en el sistema.  
 * Solo los usuarios con rol de administrador pueden acceder a este recurso.
 *
 * @apiHeader {String} Authorization Token JWT del usuario autenticado (formato: Bearer <token>).
 *
 * @apiSuccess {Object[]} orders Lista de todas las órdenes.
 * @apiSuccess {Number} orders.id ID único de la orden.
 * @apiSuccess {Number} orders.userId ID del usuario que realizó la orden.
 * @apiSuccess {Date} orders.createdAt Fecha de creación de la orden.
 * @apiSuccess {Object[]} orders.OrderItems Detalle de los ítems de la orden.
 * @apiSuccess {Number} orders.OrderItems.id ID del ítem.
 * @apiSuccess {Number} orders.OrderItems.productId ID del producto.
 * @apiSuccess {Number} orders.OrderItems.quantity Cantidad solicitada del producto.
 * @apiSuccess {Object} orders.OrderItems.Product Información del producto asociado.
 * @apiSuccess {String} orders.OrderItems.Product.nombre Nombre del producto.
 * @apiSuccess {Number} orders.OrderItems.Product.precio Precio del producto.
 *
 * @apiError (Error 401) Unauthorized Token inválido o sin permisos de administrador.
 * @apiError (Error 500) InternalServerError Error al obtener las órdenes desde la base de datos.
 *
 * @apiExample {curl} Ejemplo de uso:
 *    curl -X GET http://localhost:3000/api/orders \
 *    -H "Authorization: Bearer <token_admin>"
 *
 * @apiSuccessExample {json} Respuesta Exitosa:
 * [
 *   {
 *     "id": 10,
 *     "userId": 2,
 *     "createdAt": "2025-10-24T14:32:00.000Z",
 *     "OrderItems": [
 *       {
 *         "id": 5,
 *         "productId": 3,
 *         "quantity": 2,
 *         "Product": {
 *           "nombre": "Mouse inalámbrico",
 *           "precio": 85000
 *         }
 *       }
 *     ]
 *   }
 * ]
 */

router.get('/', verifyToken, isAdmin, getAllOrders);

/**
 * @api {get} /api/orders/:id Obtener una orden por ID
 * @apiName GetOrderById
 * @apiGroup Órdenes
 * @apiDescription Obtiene una orden específica según su ID.  
 * El usuario solo puede acceder a sus propias órdenes.
 *
 * @apiHeader {String} Authorization Token JWT del usuario autenticado (formato: Bearer <token>).
 *
 * @apiParam {Number} id ID de la orden a consultar.
 *
 * @apiSuccess {Number} id ID único de la orden.
 * @apiSuccess {Number} userId ID del usuario que realizó la orden.
 * @apiSuccess {Date} createdAt Fecha de creación de la orden.
 * @apiSuccess {Object[]} OrderItems Detalle de los ítems de la orden.
 * @apiSuccess {Number} OrderItems.id ID del ítem.
 * @apiSuccess {Number} OrderItems.productId ID del producto.
 * @apiSuccess {Number} OrderItems.quantity Cantidad solicitada del producto.
 * @apiSuccess {Object} OrderItems.Product Información del producto asociado.
 * @apiSuccess {String} OrderItems.Product.nombre Nombre del producto.
 * @apiSuccess {Number} OrderItems.Product.precio Precio del producto.
 *
 * @apiError (Error 400) BadRequest El ID no es un número entero.
 * @apiError (Error 401) Unauthorized Token inválido o usuario no autenticado.
 * @apiError (Error 404) NotFound Orden no encontrada o no pertenece al usuario.
 * @apiError (Error 500) InternalServerError Error al obtener la orden desde la base de datos.
 *
 * @apiExample {curl} Ejemplo de uso:
 *    curl -X GET http://localhost:3000/api/orders/10 \
 *    -H "Authorization: Bearer <token_usuario>"
 *
 * @apiSuccessExample {json} Respuesta Exitosa:
 * {
 *   "id": 10,
 *   "userId": 2,
 *   "createdAt": "2025-10-24T14:32:00.000Z",
 *   "OrderItems": [
 *     {
 *       "id": 5,
 *       "productId": 3,
 *       "quantity": 2,
 *       "Product": {
 *         "nombre": "Mouse inalámbrico",
 *         "precio": 85000
 *       }
 *     }
 *   ]
 * }
 */
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
