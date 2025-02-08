import React, { useState, useContext } from 'react';
import './Header.css';
import Login from './Login';
import Register from './Register';
import UserContext from './UserContext';

export default function Header({ logoutHandler }) {
  const { isLoggedIn } = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  console.log("isLoggedIn:", isLoggedIn); // Debugging line

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button className="header-button">Contact</button>
        </div>
        <div className="header-center">Truist - Gamify</div>
        <div className="header-right">
          {isLoggedIn ? (
            <button className="header-button" onClick={logoutHandler}>LOGOUT</button>
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