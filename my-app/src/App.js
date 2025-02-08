import './App.css';
import Header from './app/components/Header';
import Footer from './app/components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <p>Welcome to the Gamify App!</p>
      <p>Gamify is an web application that is designed to teach you how financial analysis 
        and provides an interactive game to help reinforce the lessons you will learn through the tutorial</p>
      <Footer />
    </div>
  );
}

export default App;

