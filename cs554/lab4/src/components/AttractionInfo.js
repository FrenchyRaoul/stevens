import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Button, Grid, Typography} from "@mui/material";
import {findBestImageUrl, makeCard} from "../util";
import {useParams} from "react-router-dom";
import NotFound404 from "./NotFound404";

import youtube from "../img/yt.png"
import twitter from "../img/tw.png"
import itunes from "../img/it.png"
import facebook from "../img/fb.png"
import spotify from "../img/sp.png"


async function getAttractionData(id) {
    const attractionUrl = `https://app.ticketmaster.com/discovery/v2/attractions/${id}?apikey=${process.env.REACT_APP_TM_APIKEY}`
    console.log(attractionUrl)
    return await axios.get(attractionUrl)
}

function getSocials(attraction) {
    const iconMap = new Map();
    iconMap.set("youtube", youtube);
    iconMap.set("twitter", twitter);
    iconMap.set("itunes", itunes);
    iconMap.set("facebook", facebook);
    iconMap.set("spotify", spotify);

    let links = [];
    if (attraction && attraction.externalLinks) {
        for (const [service, linkArray] of Object.entries(attraction.externalLinks)) {
            const url = iconMap.has(service) && linkArray[0] && linkArray[0]['url'];
            if (url) {
                links.push(
                    <a href={url} className='social-link'>
                        <img src={iconMap.get(service)} className='social-icon' alt={service}/>
                    </a>
                )
            }
        }
    }
    if (links) {
        return <Typography display="flex">{links}</Typography>
    }
    return ""
}

function getAttractionDescriptionList(classifications) {
    if (!classifications[0]) {
        return (
            <dl>
                <li>Attraction Type: Unknown</li>
            </dl>
        );
    } else {
        return (
            <dl>
                <dt>Attraction Type:</dt>
                <dd>{classifications[0].segment && classifications[0].segment.name}</dd>

                <dt>Attraction Subtype:</dt>
                <dd> {classifications[0].genre && classifications[0].genre.name}</dd>
            </dl>
        )

    }
}

function getUpcomingEvents(attraction) {
    if (attraction && attraction.upcomingEvents) {
        return (
            <Typography variant="h5" color="text.primary" component="div" align="left">
                {attraction.upcomingEvents._total} upcoming events!
            </Typography>
        )
    }
    return ""
}

function getAttractionInfo(attraction) {
    return (
        <div>
            <Typography gutterBottom variant="h5" component="div">
                {attraction.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div" align="left">
                {attraction.classifications && getAttractionDescriptionList(attraction.classifications)}
            </Typography>
            {getUpcomingEvents(attraction)}
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
            <img src={findBestImageUrl(data.images, true)} height='300' alt='logo' />
            <Grid container direction="column" item xs={12} align="center">
                <Grid
                    item
                    container
                    spacing={0}
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                    display="flex"
                    justify="center"
                >
                    {getAttractionInfo(data)}
                    <br />
                    {getSocials(data)}
                    <Button variant="outlined" size="medium" href={data.url}>Go to attraction website</Button>
                </Grid>
            </Grid>
        </div>
)
}

const AttractionCard = (attraction) => {
    return makeCard(attraction, getAttractionInfo(attraction), 'attractions');
}


export {AttractionCard, AttractionInfo, getAttractionInfo};