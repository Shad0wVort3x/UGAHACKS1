import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="footer">
      <button className="footer-button" onClick={() => navigate('/game')}>PLAY</button>
      <button className="footer-button">Leaderboard</button>
    </div>
  );
};

export default Footer;