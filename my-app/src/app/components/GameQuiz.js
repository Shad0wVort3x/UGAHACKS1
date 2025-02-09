import React from 'react';
import './GameQuiz.css';

const GameQuiz = () => {
    return (
        <div className='game-quiz'>
            <h1>Practice</h1>
            <div className='quiz-box'>
                <p><strong>Calculate the Current Ratio:</strong></p>
                <p><strong>Calculate the Net Profit Margin:</strong></p>
                <p><strong>Calculate the ROA:</strong></p>
                <p><strong>Calculate the EBITDA:</strong></p>
            </div>
        </div>
    );
};

export default GameQuiz;