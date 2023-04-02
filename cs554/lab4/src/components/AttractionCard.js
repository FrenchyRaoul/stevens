import React from "react";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import {findBestImageUrl, makeCard} from "../util";

import imgNotFound from '../img/not_found.png';

const AttractionInfo = (attraction)=>{
    return (
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {attraction.name}
            </Typography>
        </CardContent>
    )
}

export const AttractionCard = (attraction) => {

    return makeCard(attraction, AttractionInfo(attraction), 'attractions');
}

export default AttractionCard;