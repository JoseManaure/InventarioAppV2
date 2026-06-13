const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token requerido'
    });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    console.log('JWT:', decoded);

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();

  } catch (error) {

    return res.status(401).json({
      error: 'Token inválido'
    });
  }
}

module.exports = verifyToken;