const express = require('express');
const Company = require('../models/Company');
const router = express.Router();

// Get leaderboard for a specific company
router.get('/leaderboard/:companyName', async (req, res) => {
    try {
        const { companyName } = req.params;

        // Find all companies with the given name and sort by income in descending order
        const leaderboard = await Company.find({ name: companyName.toUpperCase() })
            .sort({ income: -1 })
            .select('userId income')
            .exec();

        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error.message);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

module.exports = router;
