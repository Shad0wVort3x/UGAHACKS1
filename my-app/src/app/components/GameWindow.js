import React from 'react';
import GameFooter from './GameFooter';
import './GameWindow.css';
import CompanyStats from './CompanyStats';
import GameScenario from './GameScenario'; // Corrected import
import GameQuiz from './GameQuiz';

class GameWindow extends React.Component {
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
      <div>
        <GameScenario /> {/* Corrected component usage */}
        <CompanyStats />
        <GameQuiz />

        <div className="game-scenario">
          <p>{/* Add game scenario description here */}</p>
        </div>
        
        <GameFooter />
      </div>
    );
  }
}

export default GameWindow;
