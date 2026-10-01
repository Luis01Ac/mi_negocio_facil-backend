const express = require('express');
const pool = require('../db');

const verificarToken = require('../middleware/auth');

const router = express.Router();

// REPORTE DE VENTAS
router.get('/ventas', verificarToken, async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        v.id,
        v.fecha_venta,
        v.total,
        u.nombre AS usuario,
        COUNT(dv.id) AS cantidad_detalles
      FROM ventas v
      LEFT JOIN usuarios u ON v.usuario_id = u.id
      LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
      GROUP BY v.id, v.fecha_venta, v.total, u.nombre
      ORDER BY v.fecha_venta DESC
    `);

    res.json({
      ventas: resultado.rows
    });

  } catch (error) {
    console.error('Error al obtener reporte de ventas:', error.message);

    res.status(500).json({
      mensaje: 'Error al obtener el reporte de ventas'
    });
  }
});

module.exports = router;