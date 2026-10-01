const express = require('express');
const pool = require('./db');

const authRoutes = require('./routes/auth');

const productosRoutes = require('./routes/productos');

const ventasRoutes = require('./routes/ventas');

const reportesRoutes = require('./routes/reportes');

const app = express();

const PORT = 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/productos', productosRoutes);

app.use('/api/ventas', ventasRoutes);

app.use('/api/reportes', reportesRoutes);

// Ruta de prueba del servidor
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de MiNegocio Fácil funcionando',
    estado: 'OK'
  });
});

// Ruta para probar PostgreSQL
app.get('/api/prueba-db', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT NOW() AS fecha');

    res.json({
      mensaje: 'Conexión con PostgreSQL exitosa',
      fecha_servidor: resultado.rows[0].fecha
    });
  } catch (error) {
    console.error('Error al conectar con PostgreSQL:', error.message);

    res.status(500).json({
      mensaje: 'Error al conectar con PostgreSQL',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});