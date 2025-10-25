const Product = require('../models/product');

exports.crearProducto = async (req, res) => {
  try {
    const { numero_lote, nombre, precio, cantidad_disponible, fecha_ingreso } = req.body;
    const producto = await Product.create({ numero_lote, nombre, precio, cantidad_disponible, fecha_ingreso });
    res.status(201).json({ message: 'Producto creado exitosamente', producto });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Product.findAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Product.findByPk(id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

    await producto.update(req.body);
    res.json({ message: 'Producto actualizado correctamente', producto });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Product.findByPk(id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

    await producto.destroy();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};
