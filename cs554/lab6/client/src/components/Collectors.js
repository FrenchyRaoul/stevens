import React, {useEffect, useState} from 'react';
import '../App.css';
import {useStore} from "react-redux";
import {collectCharacter, setCollector} from "../actions";
import noImg from "../img/no_img.png";
import axios from "axios";
import {makeCharacterCard} from "./Character";

function CollectorCard(props) {
    const {name} = props;
    const characterStore = useStore().getState()['character'];
    const [image, setImage] = useState(noImg);

    let characters;
    if (name === characterStore['currentCollector']['name']) {
        characters = characterStore['currentCollector']['characters'];
    } else {
        characters = characterStore['collectors'][name];
    }

    useEffect(()=>{
        async function fetchImage(characterId) {
            try {
                const characterData = (await axios.get(
                    `http://localhost:3001/character/${characterId}`
                ))['data']
                const thumbnail = characterData['thumbnail']['path'] + "." + characterData['thumbnail']['extension'];
                setImage(thumbnail)
            } catch(e) {
                console.log(e)
            }
        }
        if (characters.length > 0) {
            fetchImage(characters[0])
        }
    }, [image])

    const selectButton = (
        <button className={true ? 'btn btn-danger mr-2' : 'btn btn-success mr-2'}
                onClick={()=>{}}>
            Select Collector
        </button>
    )

    return (
        <div className="col mb-5">
            <div className="card h-100 char-card">
                <img className="char-img card-img-top"
                     src={image}
                     onError={({ currentTarget }) => {
                         currentTarget.onerror = null; // prevents looping
                         currentTarget.src=noImg;
                     }} alt="location" />
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                </div>
                <div className="card-footer">
                    {selectButton}
                    <br/>
                </div>
            </div>
        </div>
    )

}


function Collectors(props) {
    const store = useStore();
    const state = store.getState()['character'];
    const collectors = new Set([state['currentCollector']['name'], ...Object.keys(state['collectors'])])

    const collectorCards = (
        <div className="card-deck">
            {Array.from(collectors).map((name)=>{
                return <CollectorCard name={name} />
            })}
        </div>
    )

    return (
        <div>
            <h1>This is the collector page</h1>
            <button onClick={()=>{
                store.dispatch(setCollector("the button clicker"))
            }}>Click Me</button>
            <div>
                {collectorCards}
            </div>
        </div>
    )
}

export default Collectors;