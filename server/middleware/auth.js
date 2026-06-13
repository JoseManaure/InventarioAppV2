const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const bearer = req.headers['authorization'];
  const token = bearer?.startsWith('Bearer ') ? bearer.split(' ')[1] : bearer;

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('JWT:', decoded);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = verifyToken;
