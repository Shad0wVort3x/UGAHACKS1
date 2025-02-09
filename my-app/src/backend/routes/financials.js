const express = require('express');
const axios = require('axios');
const multer = require('multer');
const Company = require('../models/Company');
const parseBalanceSheet = require('../util/parseBalanceSheet');
require('dotenv').config();

const router = express.Router();
const FMP_API_KEY = 'YzLY925pTXIfQuxY3YfLwS7G9vdInQ4Q'; // Hardcoded API key
const upload = multer({ dest: 'uploads/' });

// Fetch and store only Year 0 balance sheet
router.get('/initialize-company/:ticker/:userId', async (req, res) => {
    try {
        const { ticker, userId } = req.params;
        const year = 2019; // Default start year
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
router.get('/initialize-company/:ticker/:userId', async (req, res) => {
    try {
        const { ticker, userId } = req.params;
        const year = 2019; 
        console.log(`Fetching balance sheet for ${ticker} in year ${year} for user ${userId}`);

        const balanceSheetUrl = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?apikey=${FMP_API_KEY}`;
        const incomeStatementUrl = `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?apikey=${FMP_API_KEY}`;
        const cashFlowUrl = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${ticker}?apikey=${FMP_API_KEY}`;
        const stockPriceUrl = `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${FMP_API_KEY}`;

        const [balanceSheetResponse, incomeStatementResponse, cashFlowResponse, stockPriceResponse] = await Promise.all([
            axios.get(balanceSheetUrl),
            axios.get(incomeStatementUrl),
            axios.get(cashFlowUrl),
            axios.get(stockPriceUrl)
        ]);

        if (!balanceSheetResponse.data || balanceSheetResponse.data.length === 0) {
            return res.status(404).json({ success: false, msg: "Balance sheet data not found" });
        }

        const balanceSheetData = balanceSheetResponse.data.find(item => item.calendarYear === year);
        const incomeStatementData = incomeStatementResponse.data.find(item => item.calendarYear === year);
        const cashFlowData = cashFlowResponse.data.find(item => item.calendarYear === year);
        const stockPriceData = stockPriceResponse.data[0];

        // ✅ Store all financial details under the user’s profile
        const companyData = {
            userId, // Track individual player
            name: ticker.toUpperCase(),
            year: parseInt(year),
            income: incomeStatementData ? incomeStatementData.netIncome : 0,
            revenue: incomeStatementData ? incomeStatementData.revenue : 0,
            profit: incomeStatementData ? incomeStatementData.grossProfit : 0,
            assets: balanceSheetData ? balanceSheetData.totalAssets : 0,
            liabilities: balanceSheetData ? balanceSheetData.totalLiabilities : 0,
            shareholdersEquity: balanceSheetData ? balanceSheetData.totalStockholdersEquity : 0,
            operatingIncome: incomeStatementData ? incomeStatementData.operatingIncome : 0,
            depreciation: cashFlowData ? cashFlowData.depreciationAndAmortization : 0,
            amortization: cashFlowData ? cashFlowData.depreciationAndAmortization : 0,
            stockPrice: stockPriceData ? stockPriceData.price : 0,
            currentYear: parseInt(year),
            eventsCompleted: 0
        };

        // Save player's unique company stats
        const savedCompany = new Company(companyData);
        await savedCompany.save();

        res.json({ success: true, companyData: savedCompany });

    } catch (error) {
        console.error("❌ Error fetching initial balance sheet:", error.message);
        res.status(500).json({ success: false, error: 'Failed to fetch financial data', details: error.message });
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

router.put('/apply-event/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const event = events[Math.floor(Math.random() * events.length)];

        const company = await Company.findOne({ userId: userId });
        if (!company) return res.status(404).json({ msg: 'Player company not found' });

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
// Year-end comparison
// In backend/routes/financials.js
router.get('/year-end-comparison/:userId/:ticker', async (req, res) => {
    try {
      const { userId, ticker } = req.params;
      const company = await Company.findOne({ userId: userId });
      if (!company) return res.status(404).json({ msg: 'Player company not found' });
  
      // Next year to compare against
      const nextYear = company.currentYear + 1;
  
      // Build API URLs for balance sheet, income statement, and cash flow
      const bsUrl = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?apikey=${FMP_API_KEY}`;
      const isUrl = `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?apikey=${FMP_API_KEY}`;
      const cfUrl = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${ticker}?apikey=${FMP_API_KEY}`;
  
      const [bsResponse, isResponse, cfResponse] = await Promise.all([
        axios.get(bsUrl),
        axios.get(isUrl),
        axios.get(cfUrl)
      ]);
  
      let bsData = bsResponse.data.find(item => item.calendarYear === nextYear);
      if (!bsData) {
        console.log(`No balance sheet data for year ${nextYear}. Using fallback data.`);
        bsData = bsResponse.data.sort((a, b) => b.calendarYear - a.calendarYear)[0];
      }
  
      let isData = isResponse.data.find(item => item.calendarYear === nextYear);
      if (!isData) {
        console.log(`No income statement data for year ${nextYear}. Using fallback data.`);
        isData = isResponse.data.sort((a, b) => b.calendarYear - a.calendarYear)[0];
      }
  
      let cfData = cfResponse.data.find(item => item.calendarYear === nextYear);
      if (!cfData) {
        console.log(`No cash flow data for year ${nextYear}. Using fallback data.`);
        cfData = cfResponse.data.sort((a, b) => b.calendarYear - a.calendarYear)[0];
      }
  
      // Merge the data into one object.
      const realData = {
        name: ticker.toUpperCase(),
        year: bsData ? bsData.calendarYear : nextYear,
        income: isData ? isData.netIncome : 0,
        revenue: isData ? isData.revenue : 0,
        profit: isData ? isData.grossProfit : 0,
        assets: bsData ? bsData.totalAssets : 0,
        liabilities: bsData ? bsData.totalLiabilities : 0,
        shareholdersEquity: bsData ? bsData.totalStockholdersEquity : 0,
        operatingIncome: isData ? isData.operatingIncome : 0,
        depreciation: cfData ? cfData.depreciationAndAmortization : 0,
        amortization: cfData ? cfData.depreciationAndAmortization : 0,
        cost: isData ? isData.costOfRevenue : 0,
      };
  
      // Calculate ratios for real data:
      const realCurrentRatio = bsData ? bsData.totalAssets / bsData.totalLiabilities : 0;
      const realNetProfitMargin = isData ? (isData.revenue - isData.costOfRevenue) / isData.revenue : 0;
      const realROA = bsData ? (isData ? isData.netIncome / bsData.totalAssets : 0) : 0;
  
      // Calculate ratios for the user's company:
      const userCurrentRatio = company.assets / company.liabilities;
      const userNetProfitMargin = (company.revenue - company.cost) / company.revenue;
      const userROA = company.income / company.assets;
  
      // (Optional) Compare with previous year to award an achievement
      let previousCurrentRatio = null;
      let currentRatioAchievement = null;
      const previousYearData = await Company.findOne({ name: company.name, year: company.currentYear });
      if (previousYearData) {
        previousCurrentRatio = previousYearData.assets / previousYearData.liabilities;
        if (userCurrentRatio > previousCurrentRatio) {
          currentRatioAchievement = `Congrats! Your Current Ratio is higher than last year.`;
        }
      }
  
      res.json({
        userBalanceSheet: company,
        realBalanceSheet: {
          ...realData,
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
      console.log("Real Company Current Ratio:", realCurrentRatio);
console.log("Real Company Net Profit Margin:", realNetProfitMargin);

    } catch (error) {
      console.error('Error fetching real company balance sheet:', error.message);
      res.status(500).json({ error: 'Failed to fetch financial data' });
    }
  });
  
  
  
  

router.post('/submit-calculations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { userCurrentRatio, userNetProfitMargin, userROA } = req.body;

        const company = await Company.findById(userId);
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
router.get('/player-stats/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      console.log('Fetching company stats for userId:', userId);
      
      // Use findOne() to query by the stored userId field
      const company = await Company.findOne({ userId: userId });
      if (!company) {
        console.log('No company found for userId:', userId);
        return res.status(404).json({ msg: 'Player company not found' });
      }
      
      console.log('Found company:', company);
      res.json(company);
    } catch (error) {
      console.error('Error fetching player stats:', error.message);
      res.status(500).json({ error: 'Failed to fetch player stats' });
    }
  });


// Handle quiz questions
router.post('/quiz/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { questionId, answer } = req.body;

        // Assume you have a function to validate the answer
        const isCorrect = validateAnswer(questionId, answer);

        const company = await Company.findById(userId);
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