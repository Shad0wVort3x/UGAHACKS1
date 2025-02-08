import React, { useState, useContext } from 'react';
import './Header.css';
import Login from './Login';
import UserContext from './UserContext';

export default function Header({ logoutHandler }) {
  const { isLoggedIn } = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);

  console.log("isLoggedIn:", isLoggedIn); // Add this line to debug

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
              <button className="header-button">REGISTER</button>
            </>
          )}
        </div>
      </header>
      <Login trigger={showLogin} setTrigger={setShowLogin} />
    </>
  );
}