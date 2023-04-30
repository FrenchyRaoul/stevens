import React from 'react';
import '../App.css';
import notFound from "../img/404.png";

const NotFound404 = ()=> {
    return (
        <div>
            <img src={notFound} className='App-logo' alt='404 not found' />
            <h1>We're sorry, but this page doesn't exist!</h1>
        </div>
    )
}

export default NotFound404;