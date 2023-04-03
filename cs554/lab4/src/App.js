import './App.css';
import logo from './img/t_logo.png';
import React from 'react';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

import Events from "./components/Events";
import Home from "./components/Home";
import Venues from "./components/Venues";
import Attractions from "./components/Attractions";
import {AttractionInfo} from "./components/AttractionInfo";
import {EventInfo} from "./components/EventInfo";
import {VenueInfo} from "./components/VenueInfo";

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
              <Link className='navlink' to='/'>
                Home
              </Link>
              <Link className='navlink' to='/events/page/1'>
                Events
              </Link>
              <Link className='navlink' to='/attractions/page/1'>
                Attractions
              </Link>
              <Link className='navlink' to='/venues/page/1'>
                Venues
              </Link>
            </nav>
          </header>
          <div className='App-body'>
            <Routes>
              <Route exact path='/' element={<Home />} />
              <Route path='/events/page/:page' element={<Events />} />
              <Route path='/events/:id' element={<EventInfo />} />
              <Route path='/attractions/page/:page' element={<Attractions />} />
              <Route path='/attractions/:id' element={<AttractionInfo />} />
              <Route path='/venues/page/:page' element={<Venues />} />
              <Route path='/venues/:id' element={<VenueInfo />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
