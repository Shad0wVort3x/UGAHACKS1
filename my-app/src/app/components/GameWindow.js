import React, { useState } from 'react';
import GameFooter from './GameFooter';
import CompanyStats from './CompanyStats';
import GameScenario from './GameScenario';
import GameQuiz from './GameQuiz';
import Leaderboard from './Leaderboard';

class GameWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalAssets: null,
      totalLiabilities: null,
      totalEquity: null,
      revenue: null,
      cost: null,
      netIncome: null,
      currentRatio: null,
      netProfitMargin: null,
      roa: null,
      showLeaderboard: false, // State to manage leaderboard visibility
    };
  }

  toggleLeaderboard = () => {
    this.setState({ showLeaderboard: !this.state.showLeaderboard });
  };

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
      showLeaderboard,
    } = this.state;

    return (
      <div>
        <GameScenario />
        <CompanyStats />
        <GameQuiz />
        <GameFooter onLeaderboardClick={this.toggleLeaderboard} />
        {showLeaderboard && <Leaderboard companyName="Your Company Name" />}
      </div>
    );
  }
}

export default GameWindow;