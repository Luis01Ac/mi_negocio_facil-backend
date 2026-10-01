const express = require('express');
const pool = require('../db');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// REGISTRAR UNA VENTA
router.post('/', verificarToken, async (req, res) => {
  const client = await pool.connect();

  try {
    const { productos } = req.body;
const usuario_id = req.usuario.id;

if (!Array.isArray(productos) || productos.length === 0) {
  return res.status(400).json({
    mensaje: 'La venta debe tener al menos un producto'
  });
}

    await client.query('BEGIN');

    let total = 0;
    const detalles = [];

    // Verificar productos y calcular total
    for (const item of productos) {
      const { producto_id, cantidad } = item;

      if (!producto_id || !Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
        await client.query('ROLLBACK');

        return res.status(400).json({
          mensaje: 'Producto o cantidad inválida'
        });
      }

      const resultado = await client.query(
        `SELECT id, nombre, precio, stock
         FROM productos
         WHERE id = $1
         FOR UPDATE`,
        [producto_id]
      );

      if (resultado.rows.length === 0) {
        await client.query('ROLLBACK');

        return res.status(404).json({
          mensaje: `El producto con id ${producto_id} no existe`
        });
      }

      const producto = resultado.rows[0];

      if (producto.stock < Number(cantidad)) {
        await client.query('ROLLBACK');

        return res.status(400).json({
          mensaje: `Stock insuficiente para ${producto.nombre}`
        });
      }

      const precio = Number(producto.precio);
      const cantidadNumero = Number(cantidad);
      const subtotal = precio * cantidadNumero;

      total += subtotal;

      detalles.push({
        producto_id: producto.id,
        cantidad: cantidadNumero,
        precio_unitario: precio,
        subtotal: subtotal
      });
    }

    // Crear la venta
    const ventaResultado = await client.query(
      `INSERT INTO ventas (usuario_id, total)
       VALUES ($1, $2)
       RETURNING id, usuario_id, total, fecha_venta`,
      [usuario_id, total]
    );

    const venta = ventaResultado.rows[0];

    // Crear detalles y descontar stock
    for (const detalle of detalles) {
      await client.query(
        `INSERT INTO detalle_ventas
         (venta_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          venta.id,
          detalle.producto_id,
          detalle.cantidad,
          detalle.precio_unitario,
          detalle.subtotal
        ]
      );

      await client.query(
        `UPDATE productos
         SET stock = stock - $1
         WHERE id = $2`,
        [
          detalle.cantidad,
          detalle.producto_id
        ]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      mensaje: 'Venta registrada correctamente',
      venta: venta
    });

  } catch (error) {
    await client.query('ROLLBACK');

    console.error('Error al registrar venta:', error.message);

    res.status(500).json({
      mensaje: 'Error al registrar la venta'
    });

  } finally {
    client.release();
  }
});

module.exports = router;