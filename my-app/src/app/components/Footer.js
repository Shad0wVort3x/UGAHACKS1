import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [playClicked, setPlayClicked] = useState(false);
  const navigate = useNavigate();

  const handlePlayClick = () => {
    setPlayClicked(true);
    navigate('/game');
  };

  return (
    <div className="footer">
      {!playClicked ? (
        <button className="footer-button" onClick={handlePlayClick}>PLAY</button>
      ) : (
        <>
          <button className="footer-button">Option 1</button>
          <button className="footer-button">Option 2</button>
        </>
      )}
    </div>
  );
};

export default Footer;
