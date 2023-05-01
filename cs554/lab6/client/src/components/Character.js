import React, {useEffect, useState} from 'react';
import '../App.css';
import noImg from '../img/no_img.png'
import axios from 'axios';
import {NavLink, useParams} from "react-router-dom";
import {useStore} from "react-redux";
import {collectCharacter, deleteCollector, removeCharacter} from "../actions";

// const {characterData} = require('../exampleData')

function makeCharacterCard(characterData, collectButton) {
    const thumbnail = characterData['thumbnail']['path'] + "." + characterData['thumbnail']['extension'];

    return (
        <div className="col mb-5">
            <div className="card h-100 char-card">
                <div style={{position: 'relative'}}>
                    <img className="char-img card-img-top"
                         src={thumbnail}
                         onError={({ currentTarget }) => {
                             currentTarget.onerror = null; // prevents looping
                             currentTarget.src=noImg;
                         }} alt="location" />
                    <div className="card-body">
                        <h2 className="card-title">{characterData.name}</h2>
                    </div>
                    <NavLink className='stretched-link'
                             to={"/marvel-characters/" + characterData.id}
                             style={{color: "black"}}
                    >
                        <span className="m-5">
                        Click on card for more info...
                        </span>
                    </NavLink>
                </div>
                <div className="card-footer">
                    {collectButton}
                    <br/>
                </div>
            </div>
        </div>
    )

}

function makeMiniCharacterCard(characterData, collectButton) {
    const thumbnail = characterData['thumbnail']['path'] + "." + characterData['thumbnail']['extension'];

    return (
        <div className="col-2 m0 p-2" style={{width: '12.5%'}}>
            <div className="card h-100 char-card-mini">
                <div style={{position: 'relative'}}>
                    <img className="char-img-mini card-img-top"
                         src={thumbnail}
                         onError={({ currentTarget }) => {
                             currentTarget.onerror = null; // prevents looping
                             currentTarget.src=noImg;
                         }} alt="location" />
                    <div className="card-body p-0">
                        <p className="card-title">{characterData.name}</p>
                    </div>
                    <NavLink className='stretched-link'
                             to={"/marvel-characters/" + characterData.id}
                             style={{color: "black"}}>
                        <span className="small">
                        Click for info...
                        </span>
                    </NavLink>
                </div>
                <div className="card-footer">
                    {collectButton}
                    <br/>
                </div>
            </div>
        </div>
    )
}

function makeLargeCharacterCard(characterData, collectButton) {
    const thumbnail = characterData['thumbnail']['path'] + "." + characterData['thumbnail']['extension'];

    return (
        <div className="col mb-5">
            <div className="card h-100 char-card-large">
                    <img className="char-img-large card-img-top"
                         src={thumbnail}
                         onError={({ currentTarget }) => {
                             currentTarget.onerror = null; // prevents looping
                             currentTarget.src=noImg;
                         }} alt="location" />
                    <div className="card-body">
                        <h2 className="card-title">{characterData.name}</h2>
                        <p>{characterData.description || "No description"}</p>
                        <h3>External Links:</h3>
                        <ol>
                            {characterData.urls.map((linkData=>{
                                return <li><a href={linkData.url} target="_blank">{linkData.type}</a></li>
                            }))}
                        </ol>
                    </div>
                <div className="card-footer">
                    {collectButton}
                    <br/>
                </div>
            </div>
        </div>
    )

}


function CharacterCard(props) {
    const store = useStore()
    const state = store.getState()['character'];

    const {characterId, full, updateCollection, mini, large} = props;
    const [loading, setLoading] = useState((!props.data));
    const [data, setData] = useState(props.data || null);
    const [collection, setCollection] = useState(state['currentCollector']['characters'])
    const [collected, setCollected] = useState(collection.includes(characterId))

    console.log(`collected: `, collected)
    console.log(`collection: `, collection)

    useEffect(()=>{
        async function fetchData() {
            try {
                const result = await axios.get(
                    `http://localhost:3001/character/${characterId}`
                )
                setData(result['data'])
                setLoading(false)
            } catch(e) {
                console.log(e)
            }
        }
        fetchData();
    }, [characterId])

    useEffect(()=>{
        function updateLocalCollection() {
            const state = store.getState()['character'];
            setCollection(state['currentCollector']['characters'])
        }
        updateCollection()
        updateLocalCollection()
    }, [collected])

    function updateCollected() {
        const newState = store.getState()['character'];
        setCollected(newState['currentCollector']['characters'].includes(characterId));
    }

    store.subscribe(updateCollected)

    if (loading) {
        return <h3>Loading...</h3>
    }

    let button;
    if (collected) {
        button = (
            <button
                className='btn btn-danger w-100'
                onClick={()=>{
                    store.dispatch(removeCharacter(characterId));
                    setCollected(false);
                }}
            >Remove!</button>
        )
    } else {
        button = (
            <button
                className={(!full) ? 'btn btn-success w-100' : 'btn disabled w-100'}
                onClick={()=>{
                    store.dispatch(collectCharacter(characterId));
                    setCollected(true);
                }}
            >{(!full) ? "Collect!" : "Full"}</button>
        )
    }
    if (mini) {
        return makeMiniCharacterCard(data, button)
    } else if (large) {
        return makeLargeCharacterCard(data, button)
    } else {
        return makeCharacterCard(data, button)
    }
}

function Character(props) {
    const {id} = useParams();
    return (
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-sm-6'>
                    <CharacterCard characterId={parseInt(id)} key={id} updateCollection={()=>{}} large={true} />
                </div>
            </div>
        </div>
    )
}

export {Character as default, makeCharacterCard, CharacterCard};