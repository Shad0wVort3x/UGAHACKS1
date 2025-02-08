import React, { useContext } from 'react';
import './App.css';
import Header from './app/components/Header';
import CompanyButtons from './app/components/CompanyButtons';
import Footer from './app/components/Footer';
import { UserContext } from './app/components/UserContext';
import Login from './app/components/Login';
import Register from './app/components/Register';
import { Route, Routes } from 'react-router-dom'; // ❌ Remove BrowserRouter

function AppContent() {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <div className="App">
      <Header />
      {isLoggedIn && (
        <div className="ticker-container">
          <CompanyButtons />
        </div>
      )}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={isLoggedIn ? <CompanyButtons /> : <Login />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AppContent /> // ❌ Remove extra Router here
  );
}

export default App;
