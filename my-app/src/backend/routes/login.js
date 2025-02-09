const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userRouter = express.Router(); // Ensure userRouter is defined here

const JWT_SECRET = 'f6be9459e3800df224d0dad13754b85c4f541efef4f5c2f0504bee6da0362d59880766899df3c2538c87d7b48ee69b06d65646080bf03f8e2efca0653c939a1f';

// Login a user
userRouter.post('/', async (req, res) => { 
    try {
        const { email, password } = req.body;
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields.' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User with this email does not exist.' });
        }

        // Compare the password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect password.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Respond with the token and user details
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

userRouter.post('/api/tokenIsValid', async (req, res) => { // Ensure the route is /api/tokenIsValid
    try {
        const token = req.header('Authorization');
        if (!token) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = userRouter;
