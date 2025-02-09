import React from 'react';
import './GameFooter.css';

const GameFooter = () => {
  return (
    <div className="gamefooter">
      <button className="gfooter-button">Tutorial</button>
      <button className="gfooter-button">PLAY</button>
      <button className="gfooter-button">Leaderboard</button>
    </div>
  );
};

export default GameFooter;