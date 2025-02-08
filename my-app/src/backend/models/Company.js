const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
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
    sustainabilityMetrics: { type: Number, default: 0 }, // ESG metric
    stockPrice: { type: Number, default: 0 }, // Stock value that changes based on events
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If user uploads their own balance sheet
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
