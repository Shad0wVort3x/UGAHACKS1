const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Hardcoded JWT secret
const JWT_SECRET = 'f6be9459e3800df224d0dad13754b85c4f541efef4f5c2f0504bee6da0362d59880766899df3c2538c87d7b48ee69b06d65646080bf03f8e2efca0653c939a1f';

const auth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  console.log("🔹 Received Token:", token); // Debugging
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Decoded Token:", decoded); // Debugging
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user._id;
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error); // Debugging
    res.status(401).send({ message: 'Unauthorized: Invalid Token' });
  }
};

module.exports = auth;
