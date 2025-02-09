import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { UserContext } from './UserContext';
import GameScenario from './GameScenario';
import './CompanyButtons.css';

const CompanyButtons = () => {
  const { user } = useContext(UserContext);
  const [userId, setUserId] = useState(null);
  const [ticker, setTicker] = useState('');
  const [companyData, setCompanyData] = useState(null);
  const [event, setEvent] = useState(null);
  const [eventsCompleted, setEventsCompleted] = useState(0);
  const fileInput = useRef(null);
  const navigate = useNavigate();

  React.useEffect(() => {
      const userdata = JSON.parse(localStorage.getItem('userData'));
      console.log("User Data:", userdata);
      if (userdata && userdata.user) {
        setUserId(userdata.user.id);
      }
  
    }, []); // Ensure it fetches only when userId is available

  const handleTickerChange = (e) => {
    setTicker(e.target.value);
  };

  const handleSelectCompany = async () => {
    try {
        console.log(`Fetching company data for ${ticker} for user ${userId}`);

        const response = await axios.get(`http://localhost:3001/api/financials/initialize-company/${ticker}/${userId}`);

        console.log("API Response:", response.data);
        if (!response.data.success) {
            console.error("API Error:", response.data.msg);
            alert("Failed to fetch company data. Please check your ticker symbol and try again.");
            return;
        }

        setCompanyData(response.data.companyData);

        // Ensure we wait for the event before rendering the game
        const eventResponse = await axios.get('http://localhost:3001/api/events/generate-event');
        setEvent(eventResponse.data);

        navigate("/game"); // Move to game screen only when data is ready
    } catch (error) {
        console.error("Error fetching company data:", error.response?.data || error.message);
        alert("Failed to fetch company data. Please try again.");
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
        choiceIndex,
        event,
      });

      setCompanyData(response.data.company);
      setEventsCompleted(eventsCompleted + 1);

      if (eventsCompleted < 4) {
        await generateEvent();
      } else {
        // Handle end of year logic here
        console.log('End of year');
        setEventsCompleted(0); // Reset events for the next year
        // Perform year-end comparison here
      }
    } catch (error) {
      console.error('Error applying event:', error);
    }
  };

  const handleUploadClick = () => {
    fileInput.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      console.log("pdf file is selected: ", file);
      navigate("/game"); 
    } else {
      console.log("Please select a pdf file");
    }
  };

  const handleSelectCompanyClick = () => {
    navigate("/game");
  };

  return (
    <div className="company-buttons">
      <input
        type="text"
        placeholder="Enter Ticker Symbol"
        value={ticker}
        onChange={handleTickerChange}
      />
      <button onClick={handleSelectCompany}>Select Company</button>
      <button className="company-button" onClick={handleUploadClick}>Upload Company (PDF)</button>
      <input type="file" ref={fileInput} style={{ display: "none" }} onChange={handleFileChange} />
      {companyData && (
        <div className="company-data">
          <h3>Company Data</h3>
          <p><strong>Name:</strong> {companyData.name}</p>
          <p><strong>Year:</strong> {companyData.year}</p>
          <p><strong>Income:</strong> {companyData.income}</p>
          <p><strong>Revenue:</strong> {companyData.revenue}</p>
          <p><strong>Profit:</strong> {companyData.profit}</p>
          <p><strong>Assets:</strong> {companyData.assets}</p>
          <p><strong>Liabilities:</strong> {companyData.liabilities}</p>
          <p><strong>Shareholders' Equity:</strong> {companyData.shareholdersEquity}</p>
          <p><strong>Operating Income:</strong> {companyData.operatingIncome}</p>
          <p><strong>Depreciation:</strong> {companyData.depreciation}</p>
          <p><strong>Amortization:</strong> {companyData.amortization}</p>
          <p><strong>Stock Price:</strong> {companyData.stockPrice}</p>
        </div>
      )}
      {event && (
        <GameScenario event={event} handleChoice={handleChoice} />
      )}
    </div>
  );
};

export default CompanyButtons;