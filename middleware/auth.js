const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  // aceitar tanto x-auth-token quanto Authorization: Bearer <token>
  let token = req.header('x-auth-token');
  if (!token) {
    token = req.headers.authorization?.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; 
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
