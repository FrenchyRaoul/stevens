import React from 'react';
import '../App.css';
import {Button, Grid, Typography} from "@mui/material";
import concert from "../img/concert.jpeg"

const INFO_WIDTH = "50vw"

const Home = ()=>{
    return (
        <div className='home'>
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
                    <Typography variant="h4" color="text.primary" component="div" align="left" width={INFO_WIDTH}>
                        Welcome to TicketmasterBrowser
                    </Typography>
                    <br />
                    <br />
                    <Typography variant="h5" color="text.secondary" component="div" align="left" width={INFO_WIDTH}>
                        This tool is design for event, attraction, and venue discovery. Browse Ticketmaster listings to find
                        events of interest to you.
                    </Typography>
                    <br />
                    <br />
                    <Typography variant="h4" color="text.secondary" component="div" align="left" width={INFO_WIDTH}>
                        Click on "Events", "Venues", or "Attractions" above to begin!
                    </Typography>
                </Grid>
            </Grid>
        </div>
)
}

export default Home;