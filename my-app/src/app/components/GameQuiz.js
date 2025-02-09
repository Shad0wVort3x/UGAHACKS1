// GameQuiz.js
import React, { useState } from 'react';
import axios from 'axios';
import './GameQuiz.css';

const GameQuiz = ({ userId }) => {
  // Define the single quiz question
  const quizQuestion = {
    id: 1, 
    question: "Calculate the Current Ratio:"  // example question
  };

  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // POST the answer to the backend. (Ensure your backend route /quiz/:userId is active.)
      const response = await axios.post(`/quiz/${userId}`, {
        questionId: quizQuestion.id,
        answer: userAnswer,
      });

      const { isCorrect } = response.data;
      setFeedback(isCorrect ? "Correct answer!" : "Incorrect answer. Please try again.");
    } catch (error) {
      console.error("Error submitting quiz answer:", error);
      setFeedback("There was an error submitting your answer.");
    }
  };

  return (
    <div className="game-quiz">
      <h2>Quiz</h2>
      <p><strong>{quizQuestion.question}</strong></p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter your answer"
          required
        />
        <button type="submit">Submit Answer</button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
};

export default GameQuiz;
