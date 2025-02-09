import React from 'react';
import './CompanyStats.css';

const CompanyStats = ({ company }) => {
  if (!company) {
    return <div>Loading company stats...</div>;
  }

  return (
    <div className="company-stats">
      <h2>Company Stats</h2>
      <p><strong>Name:</strong> {company.name}</p>
      <p><strong>Year:</strong> {company.year}</p>
      <p><strong>Income:</strong> {company.income}</p>
      <p><strong>Revenue:</strong> {company.revenue}</p>
      <p><strong>Profit:</strong> {company.profit}</p>
      <p><strong>Assets:</strong> {company.assets}</p>
      <p><strong>Liabilities:</strong> {company.liabilities}</p>
      <p><strong>Shareholders' Equity:</strong> {company.shareholdersEquity}</p>
      <p><strong>Operating Income:</strong> {company.operatingIncome}</p>
      <p><strong>Depreciation:</strong> {company.depreciation}</p>
      <p><strong>Amortization:</strong> {company.amortization}</p>
    </div>
  );
};

export default CompanyStats;