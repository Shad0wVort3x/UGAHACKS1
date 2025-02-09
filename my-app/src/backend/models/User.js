const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true, default: uuidv4 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
  profilePicture: { type: String, default: '/default-profile.jpg' }, // Ensure default profile picture is .jpg
  Company: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
module.exports = User;