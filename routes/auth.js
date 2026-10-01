const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// REGISTRO DE USUARIO
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const usuarioExistente = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        mensaje: 'El correo electrónico ya está registrado'
      });
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, email, fecha_creacion`,
      [nombre, email, passwordEncriptada]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: resultado.rows[0]
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error.message);

    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
});


// INICIO DE SESIÓN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({
        mensaje: 'El correo y la contraseña son obligatorios'
      });
    }

    // Buscar usuario por correo
    const resultado = await pool.query(
      `SELECT id, nombre, email, password
       FROM usuarios
       WHERE email = $1`,
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos'
      });
    }

    const usuario = resultado.rows[0];

    // Comparar contraseña ingresada con el hash
    const passwordCorrecta = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos'
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h'
      }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token: token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);

    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
});


module.exports = router;