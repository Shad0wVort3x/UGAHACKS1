import React from 'react';
import './App.css';
import Header from './app/components/Header';
import CompanyButtons from './app/components/CompanyButtons';
import Footer from './app/components/Footer';
import { UserProvider } from './app/components/UserContext';
import Login from './app/components/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './app/components/Register';

function App() {
  const isLoggedin = true; 

  return (
    <UserProvider>
      <div className="App">
        <Header />
        {isLoggedin && (
          <div className="ticker-container">
            {isLoggedin && <CompanyButtons />}
          </div>
        )}
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
        <Login />
        <Footer />
      </div>
    </UserProvider>
  );
}

export default App;