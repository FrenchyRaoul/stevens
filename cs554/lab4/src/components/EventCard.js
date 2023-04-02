import React from "react";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import {findBestImageUrl, makeCard} from "../util";


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

const EventInfo = (event)=>{
    const eventDate = new Date(event.dates.start.localDate);
    const today = Date.now();
    const daysDiff = Math.floor((eventDate - today) / (1000 * 3600 * 24));
    const dateString = (eventDate !== null) ? `${eventDate.toDateString()} (${daysDiff} day${daysDiff > 1 ? "s" : ""})` : "(Unannounced Date)"
    return (
        <CardContent>
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
        </CardContent>
    )
}

export const EventCard = (event) => {
    return makeCard(event, EventInfo(event), 'events');
}

export default EventCard;