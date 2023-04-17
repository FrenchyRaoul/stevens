import React from 'react';
import './App.css';

import {ApolloClient, HttpLink, InMemoryCache, ApolloProvider} from "@apollo/client";
import {NavLink, BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Locations from './Locations';
import queries from "../queries";
import NewLocation from "./NewLocation";
import NotFound404 from "./NotFound404";


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
                            <NavLink className='navlink' to='/'>Find Places!</NavLink>
                            <NavLink className='navlink' to='/my-likes'>My Likes</NavLink>
                            <NavLink className='navlink' to='/my-locations'>My Locations</NavLink>
                            <NavLink className='navlink' to='/new-location'>New Location</NavLink>
                        </nav>
                    </header>
                </div>
                <Routes>
                    <Route exact path='/' element={<Locations query={queries.GET_LOCATIONS} />} />
                    <Route exact path='/my-likes' element={<Locations query={queries.GET_LIKE_LOCATIONS} />} />
                    <Route exact path='/my-locations' element={<Locations query={queries.GET_USER_LOCATIONS} />} />
                    <Route exact path='/new-location' element={<NewLocation />} />
                    <Route path='*' element={<NotFound404 />} status={404} />
                </Routes>
            </Router>
        </ApolloProvider>
    );
}

export default App;
