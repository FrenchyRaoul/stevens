import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import {Grid} from '@mui/material';

import '../App.css';

import {EventCard} from "./EventInfo";
import PageNav from "./PageNav";
import NotFound404 from "./NotFound404";

const maxDepth = 1000;
const size = 25;
const maxPage = Math.floor(maxDepth / size);


async function getEventData(page) {
    const eventUrl = `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_TM_APIKEY}&countryCode=US&size=${size}&page=${page}`
    return await axios.get(eventUrl)
}

async function searchEventData(searchTerm) {
    const searchUrl = `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_TM_APIKEY}&countryCode=US&keyword=${encodeURIComponent(searchTerm)}`
    console.log(`searching with url: ${searchUrl}`)
    return await axios.get(searchUrl)
}

//'dates': {'start': {'localDate': '2023-04-02',

//'sales': {'public': {'startDateTime':

const Events = ()=>{
    // const maxPage = useRef(); instead, use calculated max page
    const [page, setPage] = useState(Number(useParams()['page']))
    const [valid, setValid] = useState(true);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState(undefined);
    const [eventData, setEventData] = useState(undefined);

    function isValidPage(page) {
        return (page && Number.isInteger(page) && page <= maxPage)
    }

    useEffect(() => {
        console.log('loading event data');
        async function fetchData() {
            try {
                setLoading(true);
                console.log(`found page: ${page}`);
                const {data} = await getEventData(page - 1);
                setEventData(data['page']['totalElements'] ? data['_embedded']['events'] : []);
                console.log(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        if (isValidPage(page)) {
            setValid(true);
            fetchData();
        } else {
            setValid(false);
        }
    }, []);


    useEffect(() => {
        console.log('search useEffect fired');
        async function fetchData() {
            try {
                console.log(`in fetch searchTerm: ${searchTerm}`);
                const {data} = await searchEventData(searchTerm);
                console.log('my search data: ')
                setSearchData(data['page']['totalElements'] ? data['_embedded']['events'] : []);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        if (searchTerm) {
            console.log('searchTerm is set');
            fetchData();
        }
    }, [searchTerm]);

    const pages = {
        'maxPage': maxPage,
        'baseUrl': '/events/page',
        'changePage': setPage
    }

    const cardData = searchTerm ? searchData || [] : eventData
    console.log(searchTerm)
    console.log(searchData)
    console.log(eventData)

    if (!valid) {
        return <NotFound404 />
    }


    if (loading) {
        return (
            <div>
                {<PageNav pages={pages} searchFunc={setSearchTerm} />}
                <h2>Loading....</h2>
            </div>
        );
    } else {
        const cards = cardData.map((event) => {
            try {
                return EventCard(event)
            } catch (e) {
                console.log(event)
                throw e
            }
        })

        return (
            <div>
                {<PageNav pages={pages} searchFunc={setSearchTerm} />}
                <br />
                <br />
                <Grid
                    container
                    spacing={2}
                    sx={{
                        flexGrow: 1,
                        flexDirection: 'row'
                    }}
                >
                    {cards}
                </Grid>
            </div>
        );
    }
}

export default Events;