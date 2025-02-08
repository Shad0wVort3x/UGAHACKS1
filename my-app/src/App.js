import React from 'react';
import './App.css';
import Header from './app/components/Header';
import CompanyButtons from './app/components/CompanyButtons';
import Footer from './app/components/Footer';
import { UserProvider } from './app/components/UserContext';

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
        <Footer />
      </div>
    </UserProvider>
  );
}

export default App;