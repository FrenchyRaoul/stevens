import React, {useContext} from 'react';
import './App.css'

const Navigation = (props) => {
    return (
        <nav className='navigation'>
            <h2>Channels: </h2>
            <button onClick={props.onClick('General')}>General</button>
            <button onClick={props.onClick('Food')}>Food</button>
            <button onClick={props.onClick('Games')}>Games</button>
        </nav>
    );
}

export default Navigation;

