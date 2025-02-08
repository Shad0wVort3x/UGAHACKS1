import './App.css';
import Header from './app/components/Header';
import CompanyButtons from './app/components/CompanyButtons';


function App() {
  const isLoggedin = true; // This is a dummy value for now
  
  return (
    <div className="App">
      <Header />
      <div>
          {isLoggedin && <CompanyButtons />}
      </div>
    </div>
  );
}

export default App;

