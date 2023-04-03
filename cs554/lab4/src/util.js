import imgNotFound from "./img/not_found.png";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid} from "@mui/material";
import React from "react";

export function findBestImageUrl(images, findLargest) {
    // TODO: make this smarter
    let image = undefined;
    let maxPixels = 0;
    if (images) {
        for (let imgidx = 0; imgidx < images.length; imgidx++) {
            let current = images[imgidx]
            if (current['width'] * current['height'] > maxPixels) {
                image = current;
            }
        }
        return image['url'];
    }
    return imgNotFound;
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
                <CardActionArea href={objectUrl}>
                    <CardMedia
                        sx={{height: 140}}
                        image={findBestImageUrl(object.images)}
                        component='img'
                        title="event image"
                    /> :
                    <CardContent>
                        {content}
                    </CardContent>
                </CardActionArea>
                <Button variant="outlined" size="medium" href={object.url}>Go to webpage... (external)</Button>
            </Card>
        </Grid>
    )
}