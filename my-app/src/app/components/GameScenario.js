import React from 'react';
import './GameScenario.css';

const GameScenario = ({ event, handleChoice }) => {
  return (
    <div className="game-scenario">
      <h2>Game Scenario</h2>
      <p>{event.description}</p>
      {event.choices.map((choice, index) => (
        <button key={index} onClick={() => handleChoice(index)}>
          {choice.description}
        </button>
      ))}
    </div>
  );
};

export default GameScenario;