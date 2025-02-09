import React, { useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./CompanyButton.css";

const CompanyButtons = () => {
  const fileInput = useRef(null);
  const navigate = useNavigate();

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
    navigate("/game"); // Navigate to the GameWindow component
  };

  return (
    <div className="button-container">
      <input type="text" id="ticker" name="ticker" placeholder="e.g., AAPL" />
      <button className="company-button"onClick={handleSelectCompanyClick}>Select Company</button>
      <button className="company-button" onClick={handleUploadClick}>Upload Company (PDF)</button>
      <input type="file" ref={fileInput} style={{ display: "none" }} onChange={handleFileChange} />
    </div>
  );
};

export default CompanyButtons;