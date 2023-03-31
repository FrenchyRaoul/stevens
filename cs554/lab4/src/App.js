import './App.css';
import logo from './img/t_logo.png';
import React from 'react';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

import Events from "./components/Events";

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
              Ticketmaster event discovery!
            </h1>
            <p>
              Welcome to my ticketmaster event, attraction, and venue discovery site. This site allows you to browse
              Ticketmaster listings to find events of interest to you.
            </p>
            <Link className='showlink' to='/events/page/1'>
              Events
            </Link>
            <Link className='showlink' to='/attractions/page/1'>
              Attractions
            </Link>
            <Link className='showlink' to='/venues/page/1'>
              Venue
            </Link>
          </header>
          <br />
          <br />
          <div className='App-body'>
            <Routes>
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
