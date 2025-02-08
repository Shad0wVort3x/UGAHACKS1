import React, { useContext } from 'react';
import './Header.css';
import { useState, useEffect } from 'react';

export default function Header({logoutHandler}) {
    return (
      <header className="header">
        <div className="header-center">Truist - BitWise</div>
        <div className="header-right">
        <button className="header-button">LOGIN</button>
        <button className="header-button">REGISTER</button>
      </div>
    </header>
    );
}
