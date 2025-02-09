import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import GameFooter from './GameFooter';
import CompanyStats from './CompanyStats';
import GameScenario from './GameScenario';
import YearEndComparison from './YearEndComparison'; // Added for year-end transition
import { UserContext } from './UserContext'; // Import user context
import './GameWindow.css';

const GameWindow = () => {
  const { user } = useContext(UserContext); // Get userId from context
  const [userId, setUserId] = useState("");
  const [event, setEvent] = useState(null);
  const [eventsCompleted, setEventsCompleted] = useState(0);
  const [companyData, setCompanyData] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem('userData'));
    console.log("🔹 User Data:", userdata);
    if (userdata && userdata.user) {
      setUserId(userdata.user.id);
    }

  }, []); // Ensure it fetches only when userId is available

  useEffect(() => {
    if (userId) {
      fetchCompanyData();
      generateEvent();
    }
  }, [userId]); // Ensure it fetches only when userId is available

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/financials/player-stats/${userId}`);
      setCompanyData(response.data);
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  const generateEvent = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/events/generate-event');
      setEvent(response.data);
    } catch (error) {
      console.error('Error generating event:', error);
    }
  };

  const handleChoice = async (choiceIndex) => {
    try {
      const response = await axios.put('http://localhost:3001/api/events/apply-event', {
        userId, // Send userId to modify correct player stats
        choiceIndex,
        event
      });
  
      setCompanyData(response.data.company);
      
      const newEventsCount = eventsCompleted + 1;
      setEventsCompleted(newEventsCount);
  
      if (newEventsCount < 4) { // Note: if you want 4 events per year, check newEventsCount < 4
        generateEvent();
      } else {
        console.log('End of year reached');
        setGameOver(true); // Trigger year-end comparison screen
      }
    } catch (error) {
      console.error('Error applying event:', error);
    }
  };

  return (
    <div className="game-window">
      <h1>Trust-Gamify</h1>

      {!gameOver ? (
        <>
          <CompanyStats company={companyData} />
          {event ? (
            <GameScenario event={event} handleChoice={handleChoice} />
          ) : (
            <div>Loading event...</div>
          )}
        </>
      ) : (
        // Pass the ticker from companyData (if available) to YearEndComparison
        <YearEndComparison userId={userId} ticker={companyData?.name || 'WMT'} />
      )}
      <GameFooter />
    </div>
  );
};

export default GameWindow;