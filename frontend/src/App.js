import React, {useEffect} from 'react';
import './App.css';
import Routes from './Routes';
import Footer from './template/container/footer/FooterThree'
import Navigation from './components/Nav'
import {BrowserRouter} from 'react-router-dom'
import ScrollToTop from "./helpers/scrollToTop";
import WOW from "wowjs";

export const TOKEN_STORAGE_ID = "GG-token"

function App() {
  useEffect(() => {
    new WOW.WOW().init();
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
          <ScrollToTop>
            <Navigation />
            <Routes />
            <Footer />
          </ScrollToTop>
      </BrowserRouter>
    </div>
  );
}

export default App;
