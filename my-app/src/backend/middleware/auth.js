require('dotenv').config();
const jwt = require('jsonwebtoken');

JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const auth = async (req, res, next) => {
    try {
      const token = req.header('Authorization');
      if (!token) return res.status(401).json({ msg: 'No authentication token, authorization denied.' });
  
      const tokenParts = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
      const verified = jwt.verify(tokenParts, JWT_SECRET);
      if (!verified) return res.status(401).json({ msg: 'Token verification failed, authorization denied.' });
  
      req.user = verified.id;
  
      console.log("Decoded user ID from token:", req.user); // Log decoded user ID
  
      next();
    } catch (err) {
      console.error("Error in auth middleware:", err.message); // Log any errors
      res.status(500).json({ error: err.message });
    }
  };
  

module.exports = auth;