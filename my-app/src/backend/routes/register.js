const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Register a new user
userRouter.post('/', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if email and password are provided
        if (!email || !password || !name) {
            return res.status(400).json({ msg: 'Please enter all fields.' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
        });

        // Save the user to the database
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET);

        // Respond with the token and user details
        res.json({
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = userRouter;