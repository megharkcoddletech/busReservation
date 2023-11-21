const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader === undefined) {
    res.status(404).json({ error: 'no token provided' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'userkey', () => {
    try {
      next();
    } catch (err) {
      res.status(500).json({ success: false, message: 'internal server error' });
    }
  });
}

module.exports = {
  verifyToken,
};
