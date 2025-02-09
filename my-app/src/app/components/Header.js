import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import Login from './Login';
import Register from './Register';
import { UserContext } from './UserContext';

export default function Header({ logoutHandler }) {
  const { isLoggedIn, setIsLoggedIn, setUser } = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  console.log("isLoggedIn:", isLoggedIn); // Debugging line

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('userData');
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button className="header-button">Contact</button>
        </div>
        <div className="header-center">Truist - Gamify</div>
        <div className="header-right">
          <button className="header-button" onClick={() => navigate('/tutorial')}>How To</button>
          {isLoggedIn ? (
            <button className="header-button" onClick={handleLogout}>LOGOUT</button>
          ) : (
            <>
              <button className="header-button" onClick={() => setShowLogin(true)}>LOGIN</button>
              <button className="header-button" onClick={() => setShowRegister(true)}>REGISTER</button>
            </>
          )}
        </div>
      </header>
      <Login trigger={showLogin} setTrigger={setShowLogin} />
      <Register trigger={showRegister} setTrigger={setShowRegister} />
    </>
  );
}