import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import axios from "axios";
import {CharacterCard, makeCharacterCard} from "./Character";
import {NavLink, useParams} from "react-router-dom";
import Spinner from "./Spinner";
import {collectCharacter} from "../actions";
import {useStore} from "react-redux";

function CharacterPage() {
    const store = useStore();
    const navigate = useNavigate();
    const [page, setPage] = useState(parseInt(useParams()['pagenum']))
    const [data, setData] = useState(null);
    const [more, setMore] = useState(false)
    const [loading, setLoading] = useState(true);

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
    else {
        cards = (
            <div className="card-deck">
                {data.map((character)=>{
                    return makeCharacterCard(character, ()=>store.dispatch(collectCharacter(character.id)))
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