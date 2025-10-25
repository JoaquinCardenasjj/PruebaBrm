const { Order, OrderItem, Product } = require('../models/associations');
const logger = require("../../utils/logger");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // viene del middleware de autenticación
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Debe incluir al menos un producto' });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado` });
      }

      // Validar stock disponible
      if (item.quantity > product.cantidad_disponible) {
        logger.warn(`Stock insuficiente para el producto ${product.nombre}`);
        return res.status(400).json({
          message: `Stock insuficiente para el producto ${product.nombre}`
        });
      }

      const subtotal = product.precio * item.quantity;
      total += subtotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        subtotal
      });

      // Actualizar inventario
      product.cantidad_disponible -= item.quantity;
      await product.save();
    }

    // Crear orden principal
    const order = await Order.create({ userId, total, status: 'PENDIENTE' });

    // Crear los ítems asociados
    for (const item of orderItems) {
      await OrderItem.create({ ...item, orderId: order.id });
    }

    logger.info(`Orden creada correctamente ${order.id}`);
    res.status(201).json({
      message: 'Orden creada correctamente',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la orden' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['nombre', 'precio'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las órdenes'+error });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id, userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["nombre", "precio"] }]
        }
      ]
    });

    if (!order) return res.status(404).json({ message: "Orden no encontrada" });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la factura" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [{ model: Product }],
          required: false
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener todas las órdenes" });
  }
};





module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById
};
