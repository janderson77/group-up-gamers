import React from 'react';
import './App.css';
import Routes from './Routes';
import Navigation from './components/Nav'
import {BrowserRouter} from 'react-router-dom'

export const TOKEN_STORAGE_ID = "GG-token"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Navigation />
          <Routes />
      </BrowserRouter>
    </div>
  );
}

export default App;
