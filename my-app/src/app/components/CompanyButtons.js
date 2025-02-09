import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { UserContext } from './UserContext';
import './CompanyButtons.css';

const CompanyButtons = () => {
  const { user } = useContext(UserContext);
  const [ticker, setTicker] = useState('');
  const [companyData, setCompanyData] = useState(null);
  const fileInput = useRef(null);
  const navigate = useNavigate();

  const handleTickerChange = (e) => {
    setTicker(e.target.value);
  };

  const handleSelectCompany = async () => {
    try {
      console.log(`Fetching company data for ${ticker} for user ${user.id}`);
  
      const response = await axios.get(`http://localhost:3001/api/financials/initialize-company/${ticker}/${user.id}`);
  
      console.log("API Response:", response.data); // Debugging
      if (!response.data.success) {
        console.error("API Error:", response.data.msg);
        alert("Failed to fetch company data. Please check your ticker symbol and try again.");
        return;
      }
  
      setCompanyData(response.data.companyData);
    } catch (error) {
      console.error("Error fetching company data:", error.response?.data || error.message);
      alert("Failed to fetch company data. Please try again.");
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
    </div>
  );
};

export default CompanyButtons;