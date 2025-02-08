const express = require('express');
const Company = require('../models/Company');
const router = express.Router();

// Sample Financial Events
const events = [
    {
        id: 1,
        description: "You invested in R&D, increasing your revenue by 10% but also raising expenses.",
        impact: { revenue: 1.1, liabilities: 1.05 },
    },
    {
        id: 2,
        description: "Your company was hit with a lawsuit. You had to pay legal fees, reducing net income.",
        impact: { income: 0.85, liabilities: 1.1 },
    },
    {
        id: 3,
        description: "You switched to EV trucks, improving sustainability but at a cost.",
        impact: { assets: 0.95, sustainabilityMetrics: 1.2 },
    },
];

// Apply a Random Event
router.put('/apply-event/:companyId', async (req, res) => {
    try {
        const { companyId } = req.params;
        const event = events[Math.floor(Math.random() * events.length)];

        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ msg: 'Company not found' });

        // Modify values based on event impact
        company.revenue *= event.impact.revenue || 1;
        company.income *= event.impact.income || 1;
        company.assets *= event.impact.assets || 1;
        company.liabilities *= event.impact.liabilities || 1;
        company.sustainabilityMetrics *= event.impact.sustainabilityMetrics || 1;

        await company.save();
        res.json({ msg: "Event applied!", company, event });
    } catch (error) {
        console.error('Error applying event:', error);
        res.status(500).json({ error: 'Failed to apply event' });
    }
});

module.exports = router;
