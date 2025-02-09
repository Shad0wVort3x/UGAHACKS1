import React, { useContext } from 'react';
import './App.css';
import Header from './app/components/Header';
import CompanyButtons from './app/components/CompanyButtons';
import Footer from './app/components/Footer';
import { UserContext } from './app/components/UserContext';
import Login from './app/components/Login';
import Register from './app/components/Register';
import Tutorial from './app/components/Tutorial';
import { Route, Routes } from 'react-router-dom';
import GameWindow from './app/components/GameWindow';

function AppContent() {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/game" element={<GameWindow />} />
        <Route path="/" element={isLoggedIn ? <CompanyButtons /> : <Login />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;