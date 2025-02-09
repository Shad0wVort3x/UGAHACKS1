import React, { useState } from 'react';
import './Tutorial.css';

const Tutorial = () => {
    return (
        <div className="tutorial">
      <h2>Tutorial</h2>
      <div className="calculations">
        <h3>Calculations</h3>
        <div>
          <label>
            EBITDA = Operating Income + Depreciation + Amortization
           
          </label>
        </div>
        <div>
          <label>
            Current Ratio = Assets / Liabilities
            
          </label>
        </div>
        <div>
          <label>
            Net Profit Margin = (Revenue - Cost) / Revenue
            
          </label>
        </div>
        <div>
          <label>
            ROA = Net Income / Assets
            
          </label>
        </div>

      </div>

    </div>
    );
};


export default Tutorial;






    


