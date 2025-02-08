import React from 'react';
import './App.css';
import Header from './app/components/Header';
import CompanyButtons from './app/components/CompanyButtons';
import Footer from './app/components/Footer';

function App() {
  const isLoggedin = true; // This is a dummy value for now
  
  return (
    <div className="App">
      <Header />
      {isLoggedin && (
        <div className="ticker-container">
          <CompanyButtons />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;