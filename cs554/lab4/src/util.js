import imgNotFound from "./img/not_found.png";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid} from "@mui/material";
import React from "react";

export function findBestImageUrl(images) {
    // TODO: make this smarter
    return (images && images[0]) ? images[0]['url'] : imgNotFound;
}

export function makeCard(object, content, objectType) {
    const objectUrl = `/${objectType}/${object.id}`
    return (
        <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={object.id}>
            <Card sx={{
                maxWidth: 350,
                maxHeight: 600,
                margin: "0 auto",
                padding: "0.1em",
            }}>
                <CardActionArea href={object.url}>
                    <CardMedia
                        sx={{height: 140}}
                        image={findBestImageUrl(object.images)}
                        component='img'
                        title="event image"
                    /> :
                    {content}
                </CardActionArea>
                <Button variant="outlined" size="medium" href={objectUrl}>More info...</Button>
            </Card>
        </Grid>
    )
}