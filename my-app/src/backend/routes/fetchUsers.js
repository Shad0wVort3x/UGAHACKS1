const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * Route: Update a user's profile
 * Requires Authentication
 */
router.put('/users/update/:id', auth, async (req, res) => {
  const targetUserId = req.params.id;

  try {
    // Ensure the authenticated user is an admin
    const adminUser = await User.findById(req.user);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized, only admins can update other users.' });
    }

    // Find the target user by ID
    const userToUpdate = await User.findById(targetUserId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Extract fields to update from the request body
    const { name, password } = req.body;

    // Update user fields
    userToUpdate.name = name || userToUpdate.name;

    // Update password if provided and different from the current one
    if (password) {
      const isSamePassword = await bcrypt.compare(password, userToUpdate.password);
      if (!isSamePassword) {
        userToUpdate.password = await bcrypt.hash(password, 10);
      }
    }

    const updatedUser = await userToUpdate.save();
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user.', error });
  }
});

/**
 * Route: Get a specific user's profile
 * Requires Authentication
 */
router.get('/users', auth, async (req, res) => {
  try {
    console.log('Authenticated user ID:', req.user);
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Fetched user data:', user);

    res.json({
        id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;