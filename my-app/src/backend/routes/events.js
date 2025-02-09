const express = require('express');
const axios = require('axios');
const Company = require('../models/Company');
const router = express.Router();

// Free AI API URL (Mistral)
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_API_KEY = '0mLkkPS1hjZPyLJ7PctInYKyQ225A2r1';

router.get('/generate-event', async (req, res) => {
    try {
        // AI Prompt for generating structured financial events
        const prompt = `
        You are a financial event generator. Provide a response in **complete** JSON format without any text outside the JSON block.
        \`\`\`json
        Generate a financial event that affects a company's balance sheet, operating income, depreciation, amortization, income, revenue, profit, assets, liabilities, and shareholders' equity.
        The event should include:
        - A short description of the situation.
        - Two choices: One improves financials, the other worsens them.
        - Impacts for each choice (operating income, depreciation, amortization, income, revenue, profit, assets, liabilities, and shareholders' equity.).
        Example:
        {
            "description": "Your company has the option to invest in renewable energy.",
            "choices": [
                {
                    "description": "Invest in renewable energy",
                    "impact": { 
                        "operatingIncome": 1.15, 
                        "expenses": 1.05, 
                        "assets": 1.1, 
                        "liabilities": 1.02, 
                        "sustainabilityMetrics": 1.3 
                    },
                    "positive": true
                },
                {
                    "description": "Ignore sustainability investment",
                    "impact": { 
                        "operatingIncome": 0.9, 
                        "expenses": 0.95, 
                        "assets": 0.98, 
                        "liabilities": 1.05, 
                        "sustainabilityMetrics": 0.8 
                    },
                    "positive": false
                }
            ]
        }
        \`\`\`
        Ensure that your response **only contains the JSON** inside the \`\`\`json block, without any extra words or explanations.
        `;

        // Call the AI API with increased max_tokens
        const aiResponse = await axios.post(
            MISTRAL_API_URL,
            {
                model: 'mistral-small-latest', // Mistral AI model
                messages: [{ role: 'system', content: prompt }],
                max_tokens: 500 // Increased from 200 to 500
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MISTRAL_API_KEY}`
                }
            }
        );

        let eventData = aiResponse.data.choices[0]?.message?.content?.trim();

        if (!eventData) {
            throw new Error("AI response is empty or undefined.");
        }

        try {
            // Extract JSON if wrapped inside a ```json block
            eventData = eventData.replace(/^```json|```$/g, '').trim();
            eventData = JSON.parse(eventData);
        } catch (jsonError) {
            throw new Error(`Invalid JSON response from AI: ${eventData}`);
        }

        res.json(eventData);

    } catch (error) {
        console.error('Error generating event:', error.message);
        res.status(500).json({ error: 'Failed to generate event', details: error.message });
    }
});

// Apply AI-generated event
router.put('/apply-event', async (req, res) => {
    try {
        const { userId, choiceIndex, event } = req.body;
        const company = await Company.findOne({ userId });

        if (!company) return res.status(404).json({ msg: 'Player’s company data not found' });

        const choice = event.choices[choiceIndex];

        // ✅ Apply event impact
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

        company.eventsCompleted += 1;

        // ✅ Move to next year after 4 events
        if (company.eventsCompleted >= 4) {
            company.currentYear += 1;
            company.eventsCompleted = 0;
        }

        await company.save();
        res.json({ msg: "Event applied!", company, event, choice });
    } catch (error) {
        console.error('Error applying event:', error);
        res.status(500).json({ error: 'Failed to apply event' });
    }
});



module.exports = router;