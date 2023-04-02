import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import {Grid} from '@mui/material';

import '../App.css';

import PageNav from "./PageNav";
import NotFound404 from "./NotFound404";
import AttractionCard from "./AttractionCard";

const maxDepth = 1000;
const size = 25;
const maxPage = Math.floor(maxDepth / size);


async function getAttractionData(page) {
    const attractionUrl = `https://app.ticketmaster.com/discovery/v2/attractions?apikey=${process.env.REACT_APP_TM_APIKEY}&countryCode=US&size=${size}&page=${page}`
    console.log('getting attraction data')
    console.log(attractionUrl);
    return await axios.get(attractionUrl)
}

async function searchAttractionData(searchTerm) {
    const searchUrl = `https://app.ticketmaster.com/discovery/v2/attractions?apikey=${process.env.REACT_APP_TM_APIKEY}&countryCode=US&keyword=${encodeURIComponent(searchTerm)}`
    console.log(`searching with url: ${searchUrl}`)
    return await axios.get(searchUrl)
}

//'dates': {'start': {'localDate': '2023-04-02',

//'sales': {'public': {'startDateTime':

const Attractions = ()=>{
    // const maxPage = useRef(); instead, use calculated max page
    const [page, setPage] = useState(Number(useParams()['page']))
    const [valid, setValid] = useState(true);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState(undefined);
    const [attractionData, setAttractionData] = useState(undefined);

    function isValidPage(page) {
        return (page && Number.isInteger(page) && page <= maxPage)
    }

    useEffect(() => {
        console.log('loading attraction data');
        async function fetchData() {
            try {
                setLoading(true);
                console.log(`found page: ${page}`);
                const {data} = await getAttractionData(page - 1);
                setAttractionData(data['page']['totalElements'] ? data['_embedded']['attractions'] : []);
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
                const {data} = await searchAttractionData(searchTerm);
                console.log('my search data: ')
                setSearchData(data['page']['totalElements'] ? data['_embedded']['attractions'] : []);
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
        'baseUrl': '/venues/page',
        'changePage': setPage
    }

    const cardData = searchTerm ? searchData || [] : attractionData

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
    }

    const cards = cardData.map((attraction) => {
        try {
            return AttractionCard(attraction)
        } catch (e) {
            console.log(attraction)
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

export default Attractions;