const express = require('express');
const axios = require('axios');
const multer = require('multer');
const Company = require('../models/Company');
const parseBalanceSheet = require('../utils/parseBalanceSheet');
require('dotenv').config();

const router = express.Router();
const FMP_API_KEY = process.env.FMP_API_KEY;
const upload = multer({ dest: 'uploads/' });

// Fetch and store only Year 0 balance sheet
router.get('/initialize-company/:ticker/:year', async (req, res) => {
    try {
        const { ticker, year } = req.params;
        const url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?apikey=${FMP_API_KEY}`;
        
        const response = await axios.get(url);
        const data = response.data.find(item => item.calendarYear === parseInt(year));

        if (!data) {
            return res.status(404).json({ msg: 'Balance sheet data not found' });
        }

        // Store initial balance sheet for player
        const companyData = new Company({
            name: ticker.toUpperCase(),
            year: parseInt(year),
            income: data.netIncome,
            revenue: data.revenue,
            profit: data.grossProfit,
            assets: data.totalAssets,
            liabilities: data.totalLiabilities,
            shareholdersEquity: data.totalStockholdersEquity,
            operatingIncome: data.operatingIncome,
            depreciation: data.depreciationAndAmortization,
            amortization: data.depreciationAndAmortization,
            stockPrice: data.stockPrice || 0,
            currentYear: parseInt(year),
            eventsCompleted: 0,
        });

        await companyData.save();

        res.json(companyData);
    } catch (error) {
        console.error('Error fetching initial balance sheet:', error.message);
        res.status(500).json({ error: 'Failed to fetch financial data' });
    }
});

// Fetch real balance sheet for comparison at the end of each year
router.get('/compare/:ticker/:year', async (req, res) => {
    try {
        const { ticker, year } = req.params;
        const url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?apikey=${FMP_API_KEY}`;
        
        const response = await axios.get(url);
        const realData = response.data.find(item => item.calendarYear === parseInt(year));

        if (!realData) {
            return res.status(404).json({ msg: 'Comparison balance sheet data not found' });
        }

        res.json({
            name: ticker.toUpperCase(),
            year: parseInt(year),
            income: realData.netIncome,
            revenue: realData.revenue,
            profit: realData.grossProfit,
            assets: realData.totalAssets,
            liabilities: realData.totalLiabilities,
            shareholdersEquity: realData.totalStockholdersEquity,
            operatingIncome: realData.operatingIncome,
            depreciation: realData.depreciationAndAmortization,
            amortization: realData.depreciationAndAmortization,
            stockPrice: realData.stockPrice || 0,
        });
    } catch (error) {
        console.error('Error fetching real company balance sheet:', error.message);
        res.status(500).json({ error: 'Failed to fetch financial data' });
    }
});

// Handle file uploads and parse balance sheet data
router.post('/upload-balance-sheet', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        // Parse the file and extract balance sheet data
        const data = await parseBalanceSheet(file.path);

        const companyData = new Company({
            name: data.name,
            year: data.year,
            income: data.income,
            revenue: data.revenue,
            profit: data.profit,
            assets: data.assets,
            liabilities: data.liabilities,
            shareholdersEquity: data.shareholdersEquity,
            operatingIncome: data.operatingIncome,
            depreciation: data.depreciation,
            amortization: data.amortization,
            stockPrice: data.stockPrice || 0,
            currentYear: data.year,
            eventsCompleted: 0,
        });

        await companyData.save();
        res.json(companyData);
    } catch (error) {
        console.error('Error uploading balance sheet:', error.message);
        res.status(500).json({ error: 'Failed to upload balance sheet' });
    }
});

// Handle random events and update company's balance sheet
const events = [
    // Define your events here
];

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

        company.eventsCompleted += 1;

        if (company.eventsCompleted >= 4) {
            company.currentYear += 1;
            company.eventsCompleted = 0;
        }

        await company.save();
        res.json({ msg: "Event applied!", company, event });
    } catch (error) {
        console.error('Error applying event:', error);
        res.status(500).json({ error: 'Failed to apply event' });
    }
});

// Year-end comparison
router.get('/year-end-comparison/:companyId/:ticker', async (req, res) => {
    try {
        const { companyId, ticker } = req.params;

        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ msg: 'Company not found' });

        const nextYear = company.currentYear + 1;
        const url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?apikey=${FMP_API_KEY}`;

        const response = await axios.get(url);
        const realData = response.data.find(item => item.calendarYear === nextYear);

        if (!realData) {
            return res.status(404).json({ msg: 'Comparison balance sheet data not found' });
        }

        res.json({
            userBalanceSheet: company,
            realBalanceSheet: {
                name: ticker.toUpperCase(),
                year: nextYear,
                income: realData.netIncome,
                revenue: realData.revenue,
                profit: realData.grossProfit,
                assets: realData.totalAssets,
                liabilities: realData.totalLiabilities,
                shareholdersEquity: realData.totalStockholdersEquity,
                operatingIncome: realData.operatingIncome,
                depreciation: realData.depreciationAndAmortization,
                amortization: realData.depreciationAndAmortization,
                stockPrice: realData.stockPrice || 0,
            }
        });
    } catch (error) {
        console.error('Error fetching real company balance sheet:', error.message);
        res.status(500).json({ error: 'Failed to fetch financial data' });
    }
});

// Fetch player stats
router.get('/player-stats/:companyId', async (req, res) => {
    try {
        const { companyId } = req.params;
        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ msg: 'Company not found' });

        res.json(company);
    } catch (error) {
        console.error('Error fetching player stats:', error.message);
        res.status(500).json({ error: 'Failed to fetch player stats' });
    }
});

// Handle quiz questions
router.post('/quiz/:companyId', async (req, res) => {
    try {
        const { companyId } = req.params;
        const { questionId, answer } = req.body;

        // Assume you have a function to validate the answer
        const isCorrect = validateAnswer(questionId, answer);

        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ msg: 'Company not found' });

        if (isCorrect) {
            company.knowledgePoints = (company.knowledgePoints || 0) + 1;
        }

        await company.save();
        res.json({ isCorrect, knowledgePoints: company.knowledgePoints });
    } catch (error) {
        console.error('Error handling quiz question:', error.message);
        res.status(500).json({ error: 'Failed to handle quiz question' });
    }
});

module.exports = router;