const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const auth = require('../middleware/auth');
const userRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'f6be9459e3800df224d0dad13754b85c4f541efef4f5c2f0504bee6da0362d59880766899df3c2538c87d7b48ee69b06d65646080bf03f8e2efca0653c939a1f';

/**
 * Route: Update a user's profile
 * Requires Authentication
 */

// Update User Profile
userRouter.put('/profile/:id', auth, async (req, res) => {
    const targetUserId = req.params.id;

    try {
        const userToUpdate = await User.findById(targetUserId);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { name, password } = req.body;
        userToUpdate.name = name || userToUpdate.name;

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

// Get User Profile
userRouter.get('/profile/:id', auth, async (req, res) => {
    try {
        const userId = req.params.id;
        console.log('Authenticated user ID:', userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = userRouter;
