import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Typography} from "@mui/material";
import {makeCard} from "../util";
import {useParams} from "react-router-dom";
import NotFound404 from "./NotFound404";
import PageNav from "./PageNav";


async function getAttractionData(id) {
    const attractionUrl = `https://app.ticketmaster.com/discovery/v2/attractions/${id}?apikey=${process.env.REACT_APP_TM_APIKEY}`
    console.log('getting attraction data')
    console.log(attractionUrl);
    return await axios.get(attractionUrl)
}

function getAttractionInfo(attraction) {
    console.log('test attraction')
    console.log(attraction)
    return (
        <div>
            <Typography gutterBottom variant="h5" component="div">
                {attraction.name}
            </Typography>
        </div>
    )
}
const AttractionInfo = ()=>{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(undefined);
    const [valid, setValid] = useState(true);

    const {id} = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const {data} = await getAttractionData(id);
                setValid(true);
                setLoading(false);
                setData(data);
            } catch (e) {
                setValid(false);
            }
        }
        fetchData();
    }, []);

    if (!valid) {
        return <NotFound404 />
    }

    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
    }

    return (
        <div>
            {getAttractionInfo(data)}
        </div>
    )
}

const AttractionCard = (attraction) => {
    return makeCard(attraction, getAttractionInfo(attraction), 'attractions');
}


export {AttractionCard, AttractionInfo, getAttractionInfo};