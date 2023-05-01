import React from 'react';
import '../App.css';

function Home(props) {
    return (
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-lg-8'>
                    <h1>Welcome to Marvel Character Collecting!</h1>
                    <h2>Create collections of marvel characters!</h2>
                    <p>Click "find characters" to browse, or select "collectors" to manage your collections.</p>
                </div>
            </div>
        </div>
    )
}

export default Home;