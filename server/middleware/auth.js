const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
  console.log("s-a verificat token")
    if (!token) {
      return res.status(403).json({ message: 'Lipsă token de autorizare' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token invalid sau expirat' });
    }
  };

  module.exports = {verifyToken}