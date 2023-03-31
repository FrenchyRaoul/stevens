import './App.css';
import logo from './img/t_logo.png';
import React from 'react';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

import Events from "./components/Events";
import Home from "./components/Home";

// import * as dotenv from "dotenv";
// dotenv.config();
// require('dotenv-webpack').config()

function App() {
  return (
      <Router>
        <div className='App'>
          <header className='App-header'>
            <img src={logo} className='App-logo' alt='logo' />
            <h1 className='App-title'>
              TicketmasterBrowser
            </h1>
            <nav>
              <Link className='showlink' to='/'>
                Home
              </Link>
              <Link className='showlink' to='/events/page/1'>
                Events
              </Link>
              <Link className='showlink' to='/attractions/page/1'>
                Attractions
              </Link>
              <Link className='showlink' to='/venues/page/1'>
                Venue
              </Link>
            </nav>
          </header>
          <div className='App-body'>
            <Routes>
              <Route exact path='/' element={<Home />} />
              <Route path='/events/page/:page' element={<Events />} />
              <Route path='/attractions/page/:page' element={<br/>} />
              <Route path='/venues/page/:page' element={<br />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
