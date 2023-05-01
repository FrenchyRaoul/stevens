import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import axios from "axios";
import {CharacterCard} from "./Character";
import {useParams} from "react-router-dom";
import Spinner from "./Spinner";
import {useStore} from "react-redux";
import NotFound404 from "./NotFound404";

function CharacterPage() {
    const store = useStore();
    const state = store.getState()['character'];
    const navigate = useNavigate();
    const [page, setPage] = useState(parseInt(useParams()['pagenum']))
    const [data, setData] = useState(null);
    const [more, setMore] = useState(false)
    const [loading, setLoading] = useState(true);
    const [full, setFull] = useState(state['currentCollector']['characters'].length > 9)

    function updateCollection() {
        const state = store.getState()['character'];
        setFull(state['currentCollector']['characters'].length > 9)
    }

    store.subscribe(updateCollection)

    useEffect(()=>{
        async function fetchData() {
            try {
                const result = await axios.get(
                    `http://localhost:3001/marvel-characters/page/${page}`
                )
                setData(result['data']['results'])
                setMore(result['data']['more'])
                setLoading(false)
            } catch(e) {
                console.log(e)
                setData(null)
                setLoading(false)
            }
        }
        fetchData();
    }, [page])

    function changePage(pageNum) {
        setLoading(true);
        setPage(parseInt(pageNum));
        navigate(`/marvel-characters/page/${pageNum}`, { replace: true })
    }

    let cards;
    if (loading) {
        cards = (
            <div className="container">
                <div className='row justify-content-center'>
                    <div className='col-sm-6'>
                        <Spinner />
                    </div>
                </div>
            </div>
        )
    }
    else if (data === null) {
        cards = <NotFound404 />
    }
    else {
        cards = (
            <div className="card-deck">
                {data.map((character)=>{
                    return <CharacterCard
                        characterId={character.id}
                        key={character.id}
                        data={character}
                        full={full}
                        updateCollection={updateCollection}/>
                })}
            </div>
        )
    }

    const navClass = loading ? "navlink navlink-disabled" : "navlink"
    const navigation = (
        <div className='PageNav'>
            <div className='container'>
                <div className='row justify-content-center'>
                    <div className='col-sm-6'>
                        <nav className='nav'>
                            {(page > 0) ?
                                <button
                                    className={navClass}
                                    onClick={()=>changePage(page - 1)}>Previous Page </button> : ""}
                            {(more) ?
                                <button
                                    className={navClass}
                                    onClick={()=>changePage(page + 1)}>Next Page</button> : ""}
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
            {cards}
        </div>
    )
}

export default CharacterPage;