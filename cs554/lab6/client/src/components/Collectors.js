import React, {useEffect, useState} from 'react';
import '../App.css';
import {useStore} from "react-redux";
import {collectCharacter, createCollector, deleteCollector, setCollector} from "../actions";
import noImg from "../img/no_img.png";
import axios from "axios";
import Character, {CharacterCard, makeCharacterCard} from "./Character";

function getCharacters(name, characterStore) {
    let characters;
    if (name === characterStore['currentCollector']['name']) {
        characters = characterStore['currentCollector']['characters'];
    } else {
        characters = characterStore['collectors'][name];
    }
    return characters || []
}

function CollectorCard(props) {
    const store = useStore();
    const characterStore = store.getState()['character'];
    const {name, select, remove} = props;
    const [selected, setSelected] = useState(props.selected);
    const [image, setImage] = useState(noImg);


    const [characters, setCharacters] = useState(()=>{
        const chars = getCharacters(name, characterStore);
        return {
            characters: chars,
            full: (characterStore['currentCollector']['characters'].length > 9)
        }
    })
    const [characterCards, setCharacterCards] = useState(null)



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
        if (characters.characters.length > 0) {
            fetchImage(characters.characters[0])
        }
    }, [characters])

    useEffect(()=>{
        async function createCards() {
            const cards = characters.characters.map((id)=>{
                return (
                    <CharacterCard characterId={id} key={name + ":" + id} full={characters.full} updateCollection={updateCollection} mini={true} />
                )
            })
            setCharacterCards(cards)
        }
        createCards()
    }, [characters])


    function updateCollection() {
        const characterStore = store.getState()['character'];
        const newCharacters = getCharacters(name, characterStore);
        setCharacters({
            characters: newCharacters,
            full: (characterStore['currentCollector']['characters'].length > 9)
        });
    }

    store.subscribe(updateCollection)

    const selectButton = (
        <button
            className={selected ? 'btn btn-d disabled w-50 border' : 'btn btn-success w-50'}
            onClick={()=>{
                setSelected(true);
                select();
            }}
            disabled={selected}
        >
            {selected ? "Selected" : "Select Collector!"}
        </button>
    )

    let cardClass = "card h-100 collectorCard";
    if (selected) {
        cardClass += " selectedCard"
    }

    const len = characters.characters.length;

    const ret_val = (
        <div className="col mb-5">
            <div className={cardClass}>
                <img className="char-img card-img-top"
                     src={image}
                     onError={({ currentTarget }) => {
                         currentTarget.onerror = null; // prevents looping
                         currentTarget.src=noImg;
                     }} alt="location" />
                <div className="card-body">
                    <h2 className="card-title">{name}</h2>
                    <h3 className="card-text"><u>Crew size:</u>
                        <span className={(len === 10) ? "full" : "notFull"}> {len}/10</span>
                    </h3>
                </div>
                <div className="card-deck p-3">
                    {characterCards}
                </div>
                <div className="card-footer">
                    {selectButton}
                    <button className='btn btn-danger w-50' onClick={remove}>Delete Collector</button>
                    <br/>
                </div>
            </div>
        </div>
    )
    return ret_val
}


function Collectors(props) {
    const store = useStore();
    const state = store.getState()['character'];
    const [selected, setSelected] = useState(state['currentCollector']['name'])
    const [collectors, setCollectors] = useState(
        Array.from(new Set([state['currentCollector']['name'], ...Object.keys(state['collectors'])])).sort()
    )

    function updateCollectors() {
        const newState = store.getState()['character'];
        setSelected(newState['currentCollector']['name']);
        setCollectors(Array.from(new Set([newState['currentCollector']['name'],
            ...Object.keys(newState['collectors'])])).sort())
    }

    function selectCollector(name) {
        store.dispatch(setCollector(name));
        setSelected(name);
    }

    function removeCollector(name) {
        store.dispatch(deleteCollector(name));
        updateCollectors()
    }

    const collectorCards = (
        <div className="card-deck">
            {collectors.map((name)=>{
                const isSelected = (name === selected);
                return <CollectorCard
                    name={name}
                    key={name + ":" + isSelected}
                    selected={isSelected}
                    select={()=>selectCollector(name)}
                    remove={()=>removeCollector(name)}
                />
            })}
        </div>
    )

    let collectorName;

    const navigation = (
        <div className='PageNav'>
            <div className='container'>
                <div className='row justify-content-center'>
                    <div className='col-sm-6'>
                        <nav className='nav'>
                            <form className="form w-100" id="create-collector"
                                  onSubmit={(e) =>{
                                      e.preventDefault();
                                      store.dispatch(createCollector(collectorName.value))  // create collector
                                      store.dispatch(setCollector(collectorName.value)) // set collector to selected
                                      setSelected(collectorName.value)
                                      updateCollectors()
                                      collectorName.value = '';
                                      alert("Created a new collector!");
                                  }}>

                                <div className="form-group">
                                    <label className='w-100'>*Name
                                        <br />
                                        <input
                                            className='w-100'
                                            ref={(node)=>{
                                                collectorName = node;
                                            }}
                                            required
                                        />
                                    </label>
                                </div>
                                <button
                                    type='submit'
                                    className="button add-button btn">Create Collector!</button>
                            </form>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div>
            {navigation}
            <br />
            <br />
            {collectorCards}
        </div>
    )
}

export default Collectors;