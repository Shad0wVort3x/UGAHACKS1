import React, { useState } from 'react';
import './Tutorial.css';

const Tutorial = ({ onComplete }) => {
  const [ebitda, setEbitda] = useState('');
  const [currentRatio, setCurrentRatio] = useState('');
  const [netProfitMargin, setNetProfitMargin] = useState('');
  const [roa, setRoa] = useState('');
  const [isPlayEnabled, setIsPlayEnabled] = useState(false);

  const handleEbitdaChange = (e) => setEbitda(e.target.value);
  const handleCurrentRatioChange = (e) => setCurrentRatio(e.target.value);
  const handleNetProfitMarginChange = (e) => setNetProfitMargin(e.target.value);
  const handleRoaChange = (e) => setRoa(e.target.value);

  const checkAnswers = () => {
    const correctEbitda = 1000; // Example value
    const correctCurrentRatio = 2; // Example value
    const correctNetProfitMargin = 0.2; // Example value
    const correctRoa = 0.1; // Example value

    if (
      parseFloat(ebitda) === correctEbitda &&
      parseFloat(currentRatio) === correctCurrentRatio &&
      parseFloat(netProfitMargin) === correctNetProfitMargin &&
      parseFloat(roa) === correctRoa
    ) {
      setIsPlayEnabled(true);
      onComplete();
    } else {
      alert('Please check your calculations.');
    }
  };

  return (
    <div className="tutorial">
      <h2>Tutorial</h2>
      <div className="balance-sheet">
        <h3>Example Balance Sheet</h3>
        <p>Hover over the highlighted items to see descriptions.</p>
        <div className="highlight" title="Operating Income: The profit earned from core business operations.">Operating Income</div>
        <div className="highlight" title="Depreciation: The reduction in the value of an asset over time.">Depreciation</div>
        <div className="highlight" title="Amortization: The process of gradually writing off the initial cost of an asset.">Amortization</div>
        <div className="highlight" title="Assets: Resources owned by a company.">Assets</div>
        <div className="highlight" title="Liabilities: Obligations or debts owed by a company.">Liabilities</div>
        <div className="highlight" title="Revenue: The income generated from normal business operations.">Revenue</div>
        <div className="highlight" title="Cost: The expenses incurred in the production of goods or services.">Cost</div>
        <div className="highlight" title="Net Income: The total profit of a company after all expenses have been deducted.">Net Income</div>
      </div>
      <div className="calculations">
        <h3>Calculations</h3>
        <div>
          <label>
            EBITDA = Operating Income + Depreciation + Amortization
            <input type="text" value={ebitda} onChange={handleEbitdaChange} />
          </label>
        </div>
        <div>
          <label>
            Current Ratio = Assets / Liabilities
            <input type="text" value={currentRatio} onChange={handleCurrentRatioChange} />
          </label>
        </div>
        <div>
          <label>
            Net Profit Margin = (Revenue - Cost) / Revenue
            <input type="text" value={netProfitMargin} onChange={handleNetProfitMarginChange} />
          </label>
        </div>
        <div>
          <label>
            ROA = Net Income / Assets
            <input type="text" value={roa} onChange={handleRoaChange} />
          </label>
        </div>
        <button onClick={checkAnswers} disabled={isPlayEnabled}>
          Check Answers
        </button>
      </div>
      <button className="play-button" disabled={!isPlayEnabled}>
        Play
      </button>
    </div>
  );
};

export default Tutorial;