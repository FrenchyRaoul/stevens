import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useSearchParams, useParams} from "react-router-dom";
import {Button, Card, CardActions, CardActionArea, CardContent, CardMedia, Grid, Typography} from '@mui/material';
import '../App.css';
import PageNav from "./PageNav";

const maxDepth = 1000;
const size = 25;
const maxPage = Math.floor(maxDepth / size);


async function getEventData(page) {
    const eventUrl = `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_TM_APIKEY}&countryCode=US&size=${size}&page=${page}`
    return await axios.get(eventUrl)
}

function findBestImageUrl(images) {
    // TODO: make this smarter
    return images[0]['url']
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
    return <h4>{startSale}<br />{ticketPrice}</h4>
}

//'dates': {'start': {'localDate': '2023-04-02',

const EventCard = (event)=> {
    const eventDate = new Date(event.dates.start.localDate);
    const today = Date.now();
    const daysDiff = Math.floor((eventDate - today) / (1000 * 3600 * 24));
    const dateString = (eventDate !== null) ? `${eventDate.toDateString()} (${daysDiff} day${daysDiff > 1 ? "s" : ""})` : "(Unannounced Date)"
    return (
        <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={event.id}>
            <Card sx={{
                maxWidth: 350,
                maxHeight: 600,
                margin: "0 auto",
                padding: "0.1em",
            }}>
                <CardActionArea href={event.url}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image={findBestImageUrl(event.images)}
                        component='img'
                        title="event image"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {event.name}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                            {dateString}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="div" align="left">
                            {getEventDescriptionList(event.classifications)}
                            {getTicketInfo(event)}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" size="medium" href={event.url}>Go to event page!</Button>
                    </CardActions>
                </CardActionArea>
            </Card>
        </Grid>
    );

}

//'sales': {'public': {'startDateTime':

const Events = ()=>{
    // const maxPage = useRef(); instead, use calculated max page
    const [page, setPage] = useState(Number(useParams()['page']))
    const [loading, setLoading] = useState(true);
    const [eventData, setEventData] = useState(undefined);

    useEffect(() => {
        console.log('loading event data');
        async function fetchData() {
            try {
                setLoading(true);
                console.log(`found page: ${page}`);
                if (Number.isInteger(page)) {
                    const {data} = await getEventData(page - 1);
                    setEventData(data['_embedded']['events']);
                    console.log(data);
                    setLoading(false);
                } else {
                    throw "page is invalid!"
                }
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, []);

    const morePages = (page < maxPage);
    const lessPages = (page > 1);
    const pages = {
        'morePages': morePages,
        'lessPages': lessPages,
        'firstPage': '/events/page/1',
        'previousPage': {'url': `/events/page/${page-1}`, 'page': page-1},
        'nextPage': {'url': `/events/page/${page+1}`, 'page': page+1},
        'lastPage': {'url': `/events/page/${maxPage}`, 'page': maxPage},
        'changePage': setPage
    }

    if (loading) {
        return (
            <div>
                {<PageNav pages={pages} />}
                <h2>Loading....</h2>
            </div>
        );
    } else {
        const cards = eventData.map((event) => {
            return EventCard(event)
        })

        return (
            <div>
                {<PageNav pages={pages} />}
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