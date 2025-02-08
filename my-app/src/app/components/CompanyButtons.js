import React from "react";
import "./CompanyButton.css";

const CompanyButtons = () => {
  return (
    <div className="button-container">
      <button className="company-button">Select Company</button>
      <button className="company-button">Upload Company</button>
    </div>
  );
};

export default CompanyButtons;
