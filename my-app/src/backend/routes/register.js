const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

module.exports = userRouter;