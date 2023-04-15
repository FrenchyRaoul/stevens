import React from 'react';
import './App.css';
import {getPhotosFromId} from "../place/Places";

import {ApolloClient, HttpLink, InMemoryCache, ApolloProvider} from "@apollo/client";
import {NavLink, BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Home from './Home';
import Locations from './Locations';


const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: 'http://localhost:4000'
    })
})


function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <div className="App">
                    <header className="App-header">
                        <h1 className='App-title'>BoreSquare Location Browser</h1>
                        <nav>
                            <NavLink className='navlink' to='/'>Home</NavLink>
                            <NavLink className='navlink' to='/my-likes'>My Likes</NavLink>
                            <NavLink className='navlink' to='/my-locations'>My Locations</NavLink>
                            <NavLink className='navlink' to='/new-location'>New Location</NavLink>
                        </nav>
                    </header>
                </div>
                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route path='/my-likes' element={<Locations />} />
                    <Route path='/my-locations' element={<Locations />} />
                    <Route path='/new-location' element={<h1>New location</h1>} />
                </Routes>
            </Router>
        </ApolloProvider>
    );
}

export default App;
