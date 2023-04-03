import React, {useEffect, useState} from "react";
import {Button, Grid, Typography} from "@mui/material";
import {findBestImageUrl, makeCard} from "../util";
import {useParams} from "react-router-dom";
import NotFound404 from "./NotFound404";
import axios from "axios";
import {getBoxOfficeInfo, getVenueAddress, getVenueGeneralInfo, VenueInfo} from "./VenueInfo";

const INFO_WIDTH = "75vw"

async function getEventData(id) {
    const eventUrl = `https://app.ticketmaster.com/discovery/v2/events/${id}?apikey=${process.env.REACT_APP_TM_APIKEY}`
    return await axios.get(eventUrl)
}

function getEventDescriptionList(classifications) {
    if (!classifications[0]) {
        return (
            <dl>
                <li>Event Type: Unknown</li>
            </dl>
        );
    } else {
        return (
            <dl>
                <dt>Event Type:</dt>
                <dd>{classifications[0].segment && classifications[0].segment.name}</dd>

                <dt>Event Subtype:</dt>
                <dd> {classifications[0].genre && classifications[0].genre.name}</dd>
            </dl>
        )

    }
}

function getTicketInfo(event) {
    const startSale = event.sales && event.sales.public && event.sales.public.startDateTime ?
        `Tickets go on sale ${event.sales.public.startDateTime.split("T")[0]}.` : "";
    const ticketPrice = event.priceRanges && event.priceRanges[0] ? `Prices range from $${event.priceRanges[0].min} to $${event.priceRanges[0].max}.` : "";
    return <h4>{startSale}<br/>{ticketPrice}</h4>
}

function getVenueInfo(event) {
    const venue = event && event._embedded && event._embedded.venues && event._embedded.venues[0]
    if (venue) {
        return (
            <div>
                <Typography variant="h5" color="text.primary" component="div" align="left" width={INFO_WIDTH}>
                    Venue Information
                </Typography>
                <Typography variant="h6" color="text.primary" component="div" align="left" width={INFO_WIDTH}>
                    {venue.name}
                </Typography>
                <Typography variant="body" color="text.primary" component="div" align="left" width={INFO_WIDTH}>
                    {getVenueAddress(venue)}
                </Typography>
                {getVenueInfo(venue)}
                <br />
                {getVenueGeneralInfo(venue)}
                <br />
                {getBoxOfficeInfo(venue)}
            </div>
        )
    }
}

function getEventInfo(event) {
    const eventDate = new Date(event.dates.start.localDate);
    const today = Date.now();
    const daysDiff = Math.floor((eventDate - today) / (1000 * 3600 * 24));
    const dateString = (eventDate !== null) ? `${eventDate.toDateString()} (${daysDiff} day${daysDiff !== 1 ? "s" : ""})` : "(Unannounced Date)"
    return (
        <div>
            <Typography gutterBottom variant="h5" component="div">
                {event.name}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
                {dateString}
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div" align="left">
                {event.classifications && getEventDescriptionList(event.classifications)}
                {getTicketInfo(event)}
            </Typography>
        </div>
    )
}

const EventInfo = ()=> {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(undefined);
    const [valid, setValid] = useState(true);

    const {id} = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const {data} = await getEventData(id);
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
        <div style={{ margin: "30px" }}>
            <img src={findBestImageUrl(data.images, true)} height='500' alt='event image' />
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
                    <Typography component="div" align="left" width={INFO_WIDTH}>
                        {getEventInfo(data)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="div" align="left">
                        {getVenueInfo(data)}
                    </Typography>
                    <Button variant="outlined" size="medium" href={data.url}>Go to event website</Button>
                </Grid>
            </Grid>


        </div>
    )
}

const EventCard = (event) => {
    return makeCard(event, getEventInfo(event), 'events');
}

export {EventCard, EventInfo};