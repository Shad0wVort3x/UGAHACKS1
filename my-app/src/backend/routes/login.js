const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const userRouter = express.Router(); // Ensure userRouter is defined here

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Login a user
userRouter.post('/login', async (req, res) => {
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

        // Check if the user's account is not verified
        if (user.status !== 'active') {
            return res.status(403).json({ msg: 'Please verify your email before logging in.' });
        }

        // Check if the user's account is suspended
        if (user.suspended) {
            return res.status(403).json({ msg: 'Your account has been suspended.' });
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
                isAdmin: user.isAdmin,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
userRouter.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.json(false);

        const verified = jwt.verify(tokenParts[1], JWT_SECRET);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Forgot Password Route
userRouter.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User with this email does not exist.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; // 1 hour

        // Assign token and expiration to user model
        user.resetPasswordToken = token;
        user.resetPasswordExpires = resetTokenExpiration;

        // Add logging to verify the token generation
        console.log(`Generated token: ${token}, Expires at: ${new Date(resetTokenExpiration)}`);

        // Save user with the token
        await user.save();

        // Verify if the user is saved correctly with the token
        const updatedUser = await User.findOne({ email });
        console.log(`User after save: `, updatedUser);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || '4050testemail@gmail.com',
                pass: process.env.EMAIL_PASS || 'fibv rdkr jxnh ukyc',
            },
        });

        const mailOptions = {
            from: '4050testemail@gmail.com',
            to: user.email,
            subject: 'Password Reset',
            text: `Please click on the following link to reset your password: 
                   http://localhost:3000/reset-password?token=${token}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ msg: 'Error sending password reset email.' });
    }
});


// Reset Password Route
userRouter.post('/reset-password', async (req, res) => {
    const { token } = req.query; // Extract token from query parameters
    const { password } = req.body;

    console.log(`Received token from URL: ${token}`); // Log received token

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Ensure token is not expired
        });
        if (user) {
            console.log(`User found with email: ${user.email}`);
        } else {
            console.log('User not found or token expired');
        }
        if (!user) {
            console.log('User not found or token expired');
            return res.status(400).json({ msg: 'Password reset token is invalid or has expired.' });
        }

        console.log(`Found user with email: ${user.email}, stored token: ${user.resetPasswordToken}`); // Log user and stored token

        // Hash the new password and save it
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined; // Clear token
        user.resetPasswordExpires = undefined; // Clear expiration

        await user.save();

        console.log('Password updated successfully');
        res.status(200).json({ msg: 'Password updated successfully!' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ msg: 'Error resetting password.' });
    }
});





module.exports = userRouter;
