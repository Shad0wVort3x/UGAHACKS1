const express = require('express');
const axios = require('axios');
const Company = require('../models/Company');
require('dotenv').config();

const router = express.Router();
const FMP_API_KEY = process.env.FMP_API_KEY;

// Fetch balance sheet data from FMP API
router.get('/balance-sheet/:ticker/:year', async (req, res) => {
    try {
        const { ticker, year } = req.params;
        const url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?apikey=${FMP_API_KEY}`;
        
        const response = await axios.get(url);
        const data = response.data.find(item => item.calendarYear === parseInt(year));

        if (!data) {
            return res.status(404).json({ msg: 'Balance sheet data not found' });
        }

        // Store company data in MongoDB
        const companyData = new Company({
            name: ticker.toUpperCase(),
            year: year,
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
        });

        await companyData.save();

        res.json(companyData);
    } catch (error) {
        console.error('Error fetching financial data:', error.message);
        res.status(500).json({ error: 'Failed to fetch financial data' });
    }
});

module.exports = router;
