const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  try {
    const encabezado = req.headers.authorization;

    if (!encabezado) {
      return res.status(401).json({
        mensaje: 'Token de autenticación requerido'
      });
    }

    const partes = encabezado.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
      return res.status(401).json({
        mensaje: 'Formato de token inválido'
      });
    }

    const token = partes[1];

    const usuario = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = usuario;

    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: 'Token inválido o expirado'
    });
  }
}

module.exports = verificarToken;