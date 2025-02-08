const express = require('express');
const axios = require('axios');
const Company = require('../models/Company');
const router = express.Router();

// Free AI API URL (Mistral)
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

// Generate AI-Powered Financial Event
router.get('/generate-event/:companyId', async (req, res) => {
    try {
        const { companyId } = req.params;
        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ msg: 'Company not found' });

        // AI Prompt for generating structured financial events
        const prompt = `
        Generate a financial event that affects a company's balance sheet, operating income, depreciation, amortization, income, revenue, profit, assets, liabilities, and shareholders' equity.
        The event should include:
        - A short description of the situation.
        - Two choices: One improves financials, the other worsens them.
        - Impacts for each choice (affecting revenue, expenses, assets, liabilities, sustainability metrics).
        Example:
        {
            "description": "Your company has the option to invest in renewable energy.",
            "choices": [
                {
                    "description": "Invest in renewable energy",
                    "impact": { "operatingIncome": 1.15, "expenses": 1.05, "assets": 1.1, "liabilities": 1.02, "sustainabilityMetrics": 1.3 },
                    "positive": true
                },
                {
                    "description": "Ignore sustainability investment",
                    "impact": { "operatingIncome": 0.9, "expenses": 0.95, "assets": 0.98, "liabilities": 1.05, "sustainabilityMetrics": 0.8 },
                    "positive": false
                }
            ]
        }`;

        // Call the AI API
        const aiResponse = await axios.post(
            MISTRAL_API_URL,
            {
                model: 'mistral-small-latest', // Mistral AI model
                messages: [{ role: 'system', content: prompt }],
                max_tokens: 200
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MISTRAL_API_KEY}`
                }
            }
        );

        const event = JSON.parse(aiResponse.data.choices[0].message.content);
        res.json(event);

    } catch (error) {
        console.error('Error generating event:', error);
        res.status(500).json({ error: 'Failed to generate event' });
    }
});

// Apply AI-generated event
router.put('/apply-event/:companyId', async (req, res) => {
    try {
        const { companyId } = req.params;
        const { choiceIndex, event } = req.body;

        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ msg: 'Company not found' });

        const choice = event.choices[choiceIndex];

        // Modify company financials based on player choice
        company.operatingIncome *= choice.impact.operatingIncome || 1;
        company.depreciation *= choice.impact.depreciation || 1;
        company.amortization *= choice.impact.amortization || 1;
        company.income *= choice.impact.income || 1;
        company.revenue *= choice.impact.revenue || 1;
        company.profit *= choice.impact.profit || 1;
        company.assets *= choice.impact.assets || 1;
        company.liabilities *= choice.impact.liabilities || 1;
        company.shareholdersEquity *= choice.impact.shareholdersEquity || 1;
        company.sustainabilityMetrics *= choice.impact.sustainabilityMetrics || 1;

        await company.save();
        res.json({ msg: "Event applied!", company, event, choice });
    } catch (error) {
        console.error('Error applying event:', error);
        res.status(500).json({ error: 'Failed to apply event' });
    }
});

module.exports = router;