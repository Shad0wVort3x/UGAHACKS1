const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    income: { type: Number, required: true },
    revenue: { type: Number, required: true },
    profit: { type: Number, required: true },
    assets: { type: Number, required: true },
    liabilities: { type: Number, required: true },
    shareholdersEquity: { type: Number, required: true },
    operatingIncome: { type: Number, required: true },
    depreciation: { type: Number, required: true },
    amortization: { type: Number, required: true },
    stockPrice: { type: Number, default: 0 },
    currentYear: { type: Number, required: true },
    eventsCompleted: { type: Number, default: 0 },
});

module.exports = mongoose.model('Company', CompanySchema);