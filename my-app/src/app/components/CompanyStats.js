import React from 'react';
import './CompanyStats.css';

const CompanyStats = () => {
    return (
        <div style={styles.container}>
        <h1>Company Stats</h1>
        <div style={styles.stats}>
          <p><strong>Total Assets:</strong> ${totalAssets.toLocaleString()}</p>
          <p><strong>Total Liabilities:</strong> ${totalLiabilities.toLocaleString()}</p>
          <p><strong>Total Equity:</strong> ${totalEquity.toLocaleString()}</p>
          <p><strong>Revenue:</strong> ${revenue.toLocaleString()}</p>
          <p><strong>Cost:</strong> ${cost.toLocaleString()}</p>
          <p><strong>Net Income:</strong> ${netIncome.toLocaleString()}</p>
        </div>
      </div>

    );
    }
    const styles = {
        container: {
          fontFamily: 'Arial, sans-serif',
          padding: '20px',
          maxWidth: '400px',
          margin: '0 auto',
          textAlign: 'left',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        stats: {
          lineHeight: '1.6',
        },
      };
    export default CompanyStats;