import React from 'react';
import './App.css';
import Header from './app/components/Header';
import CompanyButtons from './app/components/CompanyButtons';
import Footer from './app/components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <div>
        <CompanyButtons />
      </div>
      <Footer />
    </div>
  );
}

export default App;