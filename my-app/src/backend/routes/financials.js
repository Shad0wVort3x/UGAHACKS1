const express = require('express');
const axios = require('axios');
const multer = require('multer');
const Company = require('../models/Company');
const parseBalanceSheet = require('../util/parseBalanceSheet');
require('dotenv').config();

const router = express.Router();
const FMP_API_KEY = '1Wz7J5uxlHiV8OM3lZ4FHpwvBr6ohY2L'; // Hardcoded API key
const upload = multer({ dest: 'uploads/' });

// Fetch and store only Year 0 balance sheet
router.get('/initialize-company/:ticker/:userId', async (req, res) => {
    try {
        const { ticker, userId } = req.params;
        const year = 2015; // Default start year
        console.log(`Fetching balance sheet for ${ticker} in year ${year} for user ${userId}`);

        const balanceSheetUrl = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?apikey=${FMP_API_KEY}`;
        const incomeStatementUrl = `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?apikey=${FMP_API_KEY}`;
        const cashFlowUrl = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${ticker}?apikey=${FMP_API_KEY}`;
        const stockPriceUrl = `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${FMP_API_KEY}`;

        console.log("🔹 API Request URLs:", { balanceSheetUrl, incomeStatementUrl, cashFlowUrl, stockPriceUrl });

        const [balanceSheetResponse, incomeStatementResponse, cashFlowResponse, stockPriceResponse] = await Promise.all([
            axios.get(balanceSheetUrl),
            axios.get(incomeStatementUrl),
            axios.get(cashFlowUrl),
            axios.get(stockPriceUrl)
        ]);

        console.log("🔹 FMP API Raw Responses:", {
            balanceSheet: balanceSheetResponse.data,
            incomeStatement: incomeStatementResponse.data,
            cashFlow: cashFlowResponse.data,
            stockPrice: stockPriceResponse.data
        });

        if (!balanceSheetResponse.data || balanceSheetResponse.data.length === 0) {
            console.log("❌ No balance sheet data found for the ticker.");
            return res.status(404).json({ success: false, msg: "Balance sheet data not found" });
        }

        // Find the closest available year data
        let balanceSheetData = balanceSheetResponse.data.find(item => item.calendarYear === year);
        if (!balanceSheetData) {
            console.log(`❌ No balance sheet found for ${year}. Trying to find the closest available year.`);
            balanceSheetData = balanceSheetResponse.data.sort((a, b) => Math.abs(year - a.calendarYear) - Math.abs(year - b.calendarYear))[0];
            if (!balanceSheetData) {
                console.log("❌ No suitable balance sheet data found.");
                return res.status(404).json({ success: false, msg: "No suitable balance sheet data found" });
            }
        }

        // Find the closest available year data for income statement
        let incomeStatementData = incomeStatementResponse.data.find(item => item.calendarYear === year);
        if (!incomeStatementData) {
            console.log(`❌ No income statement found for ${year}. Trying to find the closest available year.`);
            incomeStatementData = incomeStatementResponse.data.sort((a, b) => Math.abs(year - a.calendarYear) - Math.abs(year - b.calendarYear))[0];
        }

        // Find the closest available year data for cash flow statement
        let cashFlowData = cashFlowResponse.data.find(item => item.calendarYear === year);
        if (!cashFlowData) {
            console.log(`❌ No cash flow statement found for ${year}. Trying to find the closest available year.`);
            cashFlowData = cashFlowResponse.data.sort((a, b) => Math.abs(year - a.calendarYear) - Math.abs(year - b.calendarYear))[0];
        }

        // Get the stock price data
        const stockPriceData = stockPriceResponse.data[0];

        console.log("✅ Extracted Data:", { balanceSheetData, incomeStatementData, cashFlowData, stockPriceData });

        // Create company data object with default values for missing fields
        const companyData = {
            name: ticker.toUpperCase(),
            year: balanceSheetData.calendarYear,
            income: incomeStatementData ? incomeStatementData.netIncome : 0,
            revenue: incomeStatementData ? incomeStatementData.revenue : 0,
            profit: incomeStatementData ? incomeStatementData.grossProfit : 0,
            assets: balanceSheetData.totalAssets || 0,
            liabilities: balanceSheetData.totalLiabilities || 0,
            shareholdersEquity: balanceSheetData.totalStockholdersEquity || 0,
            operatingIncome: incomeStatementData ? incomeStatementData.operatingIncome : 0,
            depreciation: cashFlowData ? cashFlowData.depreciationAndAmortization : 0,
            amortization: cashFlowData ? cashFlowData.depreciationAndAmortization : 0,
            stockPrice: stockPriceData ? stockPriceData.price : 0,
            currentYear: balanceSheetData.calendarYear,
            eventsCompleted: 0,
            userId: userId,
            cost: incomeStatementData ? incomeStatementData.costOfRevenue : 0,
        };

        // Save company data
        const savedCompany = new Company(companyData);
        await savedCompany.save();

        console.log("✅ Company Data Saved to Database:", savedCompany);

        res.json({ success: true, companyData: savedCompany });

    } catch (error) {
        console.error("❌ Error fetching initial balance sheet:", error.message);
        console.error("❌ Full Error:", error);
        res.status(500).json({ success: false, error: 'Failed to fetch financial data', details: error.message });
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
router.post('/upload-balance-sheet/:userId', upload.single('file'), async (req, res) => {
    try {
        const { userId } = req.params;
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
            userId: userId, // Store userId
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

        // Calculate financial ratios for the real company
        const realCurrentRatio = realData.totalAssets / realData.totalLiabilities;
        const realNetProfitMargin = (realData.revenue - realData.costOfRevenue) / realData.revenue;
        const realROA = realData.netIncome / realData.totalAssets;

        // Calculate financial ratios for the user's company
        const userCurrentRatio = company.assets / company.liabilities;
        const userNetProfitMargin = (company.revenue - company.cost) / company.revenue;
        const userROA = company.income / company.assets;

        // Compare user's current ratio with the previous year's ratio
        const previousYear = company.currentYear;
        const previousYearData = await Company.findOne({ name: company.name, year: previousYear });
        let previousCurrentRatio = null;
        let currentRatioAchievement = null;

        if (previousYearData) {
            previousCurrentRatio = previousYearData.assets / previousYearData.liabilities;
            if (userCurrentRatio > previousCurrentRatio) {
                currentRatioAchievement = `Congrats your Current Ratio is higher than last year! Achievement unlocked: Improved Current Ratio!`;
            }
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
                cost: realData.costOfRevenue, // Add cost field
                currentRatio: realCurrentRatio,
                netProfitMargin: realNetProfitMargin,
                ROA: realROA,
            },
            userFinancialRatios: {
                currentRatio: userCurrentRatio,
                netProfitMargin: userNetProfitMargin,
                ROA: userROA,
            },
            previousCurrentRatio,
            currentRatioAchievement,
        });
    } catch (error) {
        console.error('Error fetching real company balance sheet:', error.message);
        res.status(500).json({ error: 'Failed to fetch financial data' });
    }
});

router.post('/submit-calculations/:companyId', async (req, res) => {
    try {
        const { companyId } = req.params;
        const { userCurrentRatio, userNetProfitMargin, userROA } = req.body;

        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ msg: 'Company not found' });

        const nextYear = company.currentYear + 1;
        const url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${company.name}?apikey=${FMP_API_KEY}`;

        const response = await axios.get(url);
        const realData = response.data.find(item => item.calendarYear === nextYear);

        if (!realData) {
            return res.status(404).json({ msg: 'Comparison balance sheet data not found' });
        }

        // Calculate financial ratios for the real company
        const realCurrentRatio = realData.totalAssets / realData.totalLiabilities;
        const realNetProfitMargin = (realData.revenue - realData.costOfRevenue) / realData.revenue;
        const realROA = realData.netIncome / realData.totalAssets;

        // Determine if the user is doing better
        const achievements = [];
        if (userCurrentRatio > realCurrentRatio) {
            achievements.push(`Congrats your Current Ratio is higher than ${company.name}'s Current Ratio! Achievement unlocked: Get a better Current Ratio!`);
        }
        if (userNetProfitMargin > realNetProfitMargin) {
            achievements.push(`Congrats your Net Profit Margin is higher than ${company.name}'s Net Profit Margin! Achievement unlocked: Get a better Net Profit Margin!`);
        }
        if (userROA > realROA) {
            achievements.push(`Congrats your ROA is higher than ${company.name}'s ROA! Achievement unlocked: Get a better ROA!`);
        }

        res.json({
            realFinancialRatios: {
                currentRatio: realCurrentRatio,
                netProfitMargin: realNetProfitMargin,
                ROA: realROA,
            },
            userFinancialRatios: {
                currentRatio: userCurrentRatio,
                netProfitMargin: userNetProfitMargin,
                ROA: userROA,
            },
            achievements,
        });
    } catch (error) {
        console.error('Error submitting user calculations:', error.message);
        res.status(500).json({ error: 'Failed to submit user calculations' });
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