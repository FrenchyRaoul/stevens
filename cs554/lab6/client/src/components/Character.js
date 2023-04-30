import React, {useEffect, useState} from 'react';
import '../App.css';
import noImg from '../img/no_img.png'
import axios from 'axios';
import {useParams} from "react-router-dom";
import {useStore} from "react-redux";
import {collectCharacter} from "../actions";

// const {characterData} = require('../exampleData')

function makeCharacterCard(characterData, collectFunction) {
    const collected = false;

    const collectButton = (
        <button className={collected ? 'btn btn-danger mr-2' : 'btn btn-success mr-2'}
                onClick={collectFunction}>
            {collected ? "Remove from collection" : "Collect!"}
        </button>
    )

    const thumbnail = characterData['thumbnail']['path'] + "." + characterData['thumbnail']['extension'];

    return (
        <div className="col mb-5">
            <div className="card h-100 char-card">
                <img className="char-img card-img-top"
                     src={thumbnail}
                     onError={({ currentTarget }) => {
                         currentTarget.onerror = null; // prevents looping
                         currentTarget.src=noImg;
                     }} alt="location" />
                <div className="card-body">
                    <h5 className="card-title">{characterData.name}</h5>
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
    const store = useStore();

    const {characterId} = props;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

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

    if (loading) {
        return <h3>Loading...</h3>
    }

    return makeCharacterCard(data, ()=>store.dispatch(collectCharacter(characterId)))
}

function Character(props) {
    const {id} = useParams();
    return (
        <CharacterCard characterId={id} />
    )
}

export {Character as default, makeCharacterCard};