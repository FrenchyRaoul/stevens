import React from 'react';
import '../App.css';

import {NavLink, BrowserRouter as Router, Route, Routes} from "react-router-dom";
import CharacterPage from "./CharacterPage";
import Character  from "./Character";
import Collectors from "./Collectors";
import NotFound404 from "./NotFound404";
import Home from "./Home";
import {Provider} from "react-redux";
import store from '../store';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <div className="App">
                    <header className="App-header">
                        <h1 className='App-title'>Marvel Character Collector</h1>
                        <nav className='nav'>
                            <NavLink className='navlink' to='/'>Home</NavLink>
                            <NavLink className='navlink' to='/marvel-characters/page/0'>Find Characters</NavLink>
                            <NavLink className='navlink' to='/collectors'>Collectors</NavLink>
                        </nav>
                    </header>
                </div>
                <div className='App-body'>
                    <Routes>
                        <Route exact path='/' element={<Home />} />
                        <Route exact path='/marvel-characters/page/:pagenum' element={<CharacterPage />} />
                        <Route exact path='/marvel-characters/:id' element={<Character />} />
                        <Route exact path='/collectors' element={<Collectors />} />
                        <Route path='*' element={<NotFound404 />} status={404} />
                    </Routes>
                </div>
            </Router>
        </Provider>
    );
}

export default App;