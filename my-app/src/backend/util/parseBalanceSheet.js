const fs = require('fs');
const pdf = require('pdf-parse');

async function parseBalanceSheet(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    // Extract text from PDF
    const text = data.text;

    // Define a function to extract a value based on a keyword
    function extractValue(keyword) {
        const regex = new RegExp(`${keyword}\\s*:\\s*([\\d,\\.]+)`, 'i');
        const match = text.match(regex);
        return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    }

    // Extract values from the text
    const name = extractValue('Company Name');
    const year = extractValue('Year');
    const income = extractValue('Net Income');
    const revenue = extractValue('Revenue');
    const profit = extractValue('Gross Profit');
    const assets = extractValue('Total Assets');
    const liabilities = extractValue('Total Liabilities');
    const shareholdersEquity = extractValue('Total Stockholders Equity');
    const operatingIncome = extractValue('Operating Income');
    const depreciation = extractValue('Depreciation and Amortization');
    const amortization = extractValue('Depreciation and Amortization');
    const stockPrice = extractValue('Stock Price');

    return {
        name,
        year,
        income,
        revenue,
        profit,
        assets,
        liabilities,
        shareholdersEquity,
        operatingIncome,
        depreciation,
        amortization,
        stockPrice,
    };
}

module.exports = parseBalanceSheet;