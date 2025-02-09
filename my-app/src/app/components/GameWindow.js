// src/App.js
import React from 'react';
import GameFooter from './GameFooter';

class TrustGamify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Add input values here
      totalAssets: null, // Input required
      totalLiabilities: null, // Input required
      totalEquity: null, // Input required
      revenue: null, // Input required
      cost: null, // Input required
      netIncome: null, // Input required
      currentRatio: null, // Input required
      netProfitMargin: null, // Input required
      roa: null, // Input required
    };
  }

  render() {
    const {
      totalAssets,
      totalLiabilities,
      totalEquity,
      revenue,
      cost,
      netIncome,
      currentRatio,
      netProfitMargin,
      roa,
    } = this.state;

    return (
      <div className="trust-gamify-container">
        <h1>Trust-Gamify</h1>

        <div className="company-stats">
          <h2>Company Stats</h2>
          <p><strong>Total Assets:</strong> {totalAssets !== null ? `$${totalAssets.toLocaleString()}` : 'Input required'}</p>
          <p><strong>Total Liabilities:</strong> {totalLiabilities !== null ? `$${totalLiabilities.toLocaleString()}` : 'Input required'}</p>
          <p><strong>Total Equity:</strong> {totalEquity !== null ? `$${totalEquity.toLocaleString()}` : 'Input required'}</p>
          <p><strong>Revenue:</strong> {revenue !== null ? `$${revenue.toLocaleString()}` : 'Input required'}</p>
          <p><strong>Cost:</strong> {cost !== null ? `$${cost.toLocaleString()}` : 'Input required'}</p>

          // quiz portion
          <p><strong>Net Income:</strong> {netIncome !== null ? `$${netIncome.toLocaleString()}` : 'Input required'}</p>
          <p><strong>Current Ratio:</strong> {currentRatio !== null ? currentRatio : 'Input required'}</p>
          <p><strong>Net Profit Margin:</strong> {netProfitMargin !== null ? `${netProfitMargin}%` : 'Input required'}</p>
          <p><strong>ROA:</strong> {roa !== null ? `${roa}%` : 'Input required'}</p>
        </div>

        <div className="game-scenario">
          <h2>Game Scenario</h2>
          <p>{/* Add game scenario description here */}</p>
        </div>

        <GameFooter />
      </div>
    );
  }
}

export default TrustGamify;