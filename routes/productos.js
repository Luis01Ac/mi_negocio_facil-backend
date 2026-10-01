const express = require('express');
const pool = require('../db');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// LISTAR PRODUCTOS
router.get('/', verificarToken, async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, nombre, descripcion, precio, stock, fecha_creacion
       FROM productos
       ORDER BY id DESC`
    );

    res.json({
      productos: resultado.rows
    });
  } catch (error) {
    console.error('Error al listar productos:', error.message);

    res.status(500).json({
      mensaje: 'Error al obtener los productos'
    });
  }
});

// CREAR PRODUCTO
router.post('/', verificarToken, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;

    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({
        mensaje: 'Nombre, precio y stock son obligatorios'
      });
    }

    if (Number(precio) < 0) {
      return res.status(400).json({
        mensaje: 'El precio no puede ser negativo'
      });
    }

    if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({
        mensaje: 'El stock debe ser un número entero mayor o igual a 0'
      });
    }

    const resultado = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, descripcion, precio, stock, fecha_creacion`,
      [
        nombre.trim(),
        descripcion || null,
        Number(precio),
        Number(stock)
      ]
    );

    res.status(201).json({
      mensaje: 'Producto creado correctamente',
      producto: resultado.rows[0]
    });

  } catch (error) {
    console.error('Error al crear producto:', error.message);

    res.status(500).json({
      mensaje: 'Error al crear el producto'
    });
  }
});

// EDITAR PRODUCTO
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;

    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({
        mensaje: 'Nombre, precio y stock son obligatorios'
      });
    }

    if (Number(precio) < 0) {
      return res.status(400).json({
        mensaje: 'El precio no puede ser negativo'
      });
    }

    if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({
        mensaje: 'El stock debe ser un número entero mayor o igual a 0'
      });
    }

    const resultado = await pool.query(
      `UPDATE productos
       SET nombre = $1,
           descripcion = $2,
           precio = $3,
           stock = $4
       WHERE id = $5
       RETURNING id, nombre, descripcion, precio, stock, fecha_creacion`,
      [
        nombre.trim(),
        descripcion || null,
        Number(precio),
        Number(stock),
        id
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }

    res.json({
      mensaje: 'Producto actualizado correctamente',
      producto: resultado.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar producto:', error.message);

    res.status(500).json({
      mensaje: 'Error al actualizar el producto'
    });
  }
});

// ELIMINAR PRODUCTO
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      'DELETE FROM productos WHERE id = $1 RETURNING id',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }

    res.json({
      mensaje: 'Producto eliminado correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar producto:', error.message);

    res.status(500).json({
      mensaje: 'Error al eliminar el producto'
    });
  }
});

module.exports = router;