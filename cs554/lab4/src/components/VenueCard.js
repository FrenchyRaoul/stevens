import React from "react";
import {CardContent, Typography} from "@mui/material";
import {makeCard} from "../util";

const VenueInfo = (venue)=>{
    return (
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {venue.name}
            </Typography>
        </CardContent>
    )
}


export const VenueCard = (venue) => {
    return makeCard(venue, VenueInfo(venue), 'venues')
}

export default VenueCard;