import React, { useRef } from "react";
import "./CompanyButton.css";

const CompanyButtons = () => {

    const fileInput = useRef(null);

    const handleUploadClick =() =>{
        fileInput.current.click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file && file.type === "application/pdf"){
            console.log("pdf file is selected: ", file);
        }else{
            console.log("Please select a pdf file");
        }
    };
  return (
    <div className="button-container">
    <input type="text" id="ticker" name="ticker" placeholder="e.g., AAPL" />
      <button className="company-button">Select Company</button>
      <button className="company-button" onClick={handleUploadClick}>Upload Company (PDF)</button>
      <input type="file" ref={fileInput} style={{display: "none"}} onChange={handleFileChange}/>
    </div>
  );
};

export default CompanyButtons;
