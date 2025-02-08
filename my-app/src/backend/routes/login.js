const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const userRouter = express.Router(); // Ensure userRouter is defined here

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

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
        const token = jwt.sign({ id: user._id }, JWT_SECRET);

        // Respond with the token and user details
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
