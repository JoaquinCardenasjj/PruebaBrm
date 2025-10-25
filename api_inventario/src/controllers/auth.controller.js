const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();


exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol
    });

    res.status(201).json({ message: 'Usuario registrado correctamente', usuario: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ message: 'Login exitoso', token, usuario: user });
  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};
