const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.rol !== 'ADMIN') return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
  next();
};
