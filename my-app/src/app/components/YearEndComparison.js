// YearEndComparison.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './YearEndComparison.css';

const YearEndComparison = ({ userId, ticker }) => {
  const [comparisonData, setComparisonData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComparisonData();
  }, [userId, ticker]);

  const fetchComparisonData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/financials/year-end-comparison/${userId}/${ticker}`);
      setComparisonData(response.data);
    } catch (err) {
      console.error('Error fetching real balance sheet:', err.message);
      setError(err.response?.data?.msg || 'Failed to fetch comparison data');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!comparisonData) {
    return <div>Loading comparison data...</div>;
  }

  const { userBalanceSheet, realBalanceSheet, userFinancialRatios, realFinancialRatios, currentRatioAchievement } = comparisonData;

  return (
    <div className="year-end-comparison">
      <h2>Year-End Comparison</h2>
      <div className="stats-section">
        <div className="stats-box">
          <h3>Your Company Stats</h3>
          <p><strong>Name:</strong> {userBalanceSheet.name}</p>
          <p><strong>Income:</strong> {userBalanceSheet.income}</p>
          <p><strong>Revenue:</strong> {userBalanceSheet.revenue}</p>
          <p><strong>Profit:</strong> {userBalanceSheet.profit}</p>
          <p><strong>Assets:</strong> {userBalanceSheet.assets}</p>
          <p><strong>Liabilities:</strong> {userBalanceSheet.liabilities}</p>
          <p><strong>Shareholders' Equity:</strong> {userBalanceSheet.shareholdersEquity}</p>
          <p><strong>Operating Income:</strong> {userBalanceSheet.operatingIncome}</p>
          <p><strong>Depreciation:</strong> {userBalanceSheet.depreciation}</p>
          <p><strong>Amortization:</strong> {userBalanceSheet.amortization}</p>
        </div>
        <div className="stats-box">
          <h3>Real Company Stats</h3>
          <p><strong>Name:</strong> {realBalanceSheet.name}</p>
          <p><strong>Income:</strong> {realBalanceSheet.income}</p>
          <p><strong>Revenue:</strong> {realBalanceSheet.revenue}</p>
          <p><strong>Profit:</strong> {realBalanceSheet.profit}</p>
          <p><strong>Assets:</strong> {realBalanceSheet.assets}</p>
          <p><strong>Liabilities:</strong> {realBalanceSheet.liabilities}</p>
          <p><strong>Shareholders' Equity:</strong> {realBalanceSheet.shareholdersEquity}</p>
          <p><strong>Operating Income:</strong> {realBalanceSheet.operatingIncome}</p>
          <p><strong>Depreciation:</strong> {realBalanceSheet.depreciation}</p>
          <p><strong>Amortization:</strong> {realBalanceSheet.amortization}</p>
          <p><strong>Current Ratio:</strong> {realBalanceSheet.currentRatio}</p>
          <p><strong>Net Profit Margin:</strong> {realBalanceSheet.netProfitMargin}</p>
          <p><strong>ROA:</strong> {realBalanceSheet.ROA}</p>
        </div>
      </div>
      {currentRatioAchievement && (
        <div className="stats-box">
          <h3>Achievement</h3>
          <p>{currentRatioAchievement}</p>
        </div>
      )}
      <div className="stats-box">
        <h3>User Financial Ratios</h3>
        <p><strong>Current Ratio:</strong> {userFinancialRatios.currentRatio}</p>
        <p><strong>Net Profit Margin:</strong> {userFinancialRatios.netProfitMargin}</p>
        <p><strong>ROA:</strong> {userFinancialRatios.ROA}</p>
      </div>
    </div>
  );
};

export default YearEndComparison;
