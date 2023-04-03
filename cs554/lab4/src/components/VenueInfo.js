import React, {useEffect, useState} from "react";
import {Button, CardContent, Grid, Typography} from "@mui/material";
import {findBestImageUrl, makeCard} from "../util";
import {useParams} from "react-router-dom";
import NotFound404 from "./NotFound404";
import axios from "axios";

const INFO_WIDTH = "75vw"

async function getVenueData(id) {
    const venueUrl = `https://app.ticketmaster.com/discovery/v2/venues/${id}?apikey=${process.env.REACT_APP_TM_APIKEY}`
    console.log(venueUrl)
    return await axios.get(venueUrl)
}

function getVenueAddress(venue) {
    return (
        <Typography variant="body2" color="text.secondary" component="div" align="left">
            {venue.address && venue.address.line1 ? venue.address.line1: ""}
            {venue.address && venue.address.line1 ? <br />: ""}
            {(venue.city && venue.city.name) || ""}
            {venue.city && venue.city.name ? ", " : ""}
            {(venue.state && venue.state.name) || ""}
        </Typography>
    )
}

function getBoxOfficeInfo(venue) {
    const ruleMap = new Map();
    ruleMap.set("phoneNumberDetail", "Phone Information:");
    ruleMap.set("openHoursDetail", "Hours:");
    ruleMap.set("acceptedPaymentDetail", "Accepted Forms of Payment:");
    ruleMap.set("willCallDetail", "Will Call:");
    if (venue && venue.boxOfficeInfo) {
        let rules = [];
        for (const [ruleName, rule] of Object.entries(venue.boxOfficeInfo)) {
            rules.push(<dt>{ruleMap.get(ruleName) || ruleName}</dt>);
            rules.push(<dd>{rule}</dd>);
        }
        return (
            <div>
                <Typography variant="h6" color="text.primary" component="div" align="left" width={INFO_WIDTH}>
                    Box Office Info
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div" align="left" width={INFO_WIDTH}>
                    <dl>{rules}</dl>
                </Typography>
            </div>
        )
    }
    return (
        <Typography variant="h6" color="text.primary" component="div" align="left" width={INFO_WIDTH}>
            No Box Office Info
        </Typography>
    )
}


function getVenueGeneralInfo(venue) {
    const ruleMap = new Map();
    ruleMap.set("generalRule", "General Rules:");
    ruleMap.set("childRule", "Child Rules:");
    if (venue && venue.generalInfo) {
        let rules = [];
        for (const [ruleName, rule] of Object.entries(venue.generalInfo)) {
            rules.push(<dt>{ruleMap.get(ruleName) || ruleName}</dt>);
            rules.push(<dd>{rule}</dd>);
        }
        return (
            <div>
                <Typography variant="h6" color="text.primary" component="div" align="left" width={INFO_WIDTH}>
                    Venue Rules
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div" align="left" width={INFO_WIDTH}>
                    <dl>{rules}</dl>
                </Typography>
            </div>

        )
    }
    return (
        <Typography variant="h6" color="text.primary" component="div" align="left" width={INFO_WIDTH}>
            No Venue Rules Found
        </Typography>
    )
}

function getVenueInfo(venue) {
    return (
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {venue.name}
            </Typography>
            {getVenueAddress(venue)}
        </CardContent>
    )
}

const VenueInfo = ()=>{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(undefined);
    const [valid, setValid] = useState(true);

    const {id} = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const {data} = await getVenueData(id);
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
                    {getVenueInfo(data)}
                    <br />
                    {getVenueGeneralInfo(data)}
                    <br />
                    {getBoxOfficeInfo(data)}
                    {data.url ?
                        <Button variant="outlined" size="medium" href={data.url}>Go to venue website</Button>
                        :
                        <Button variant="outlined" size="medium" disables>No venue website</Button>
                    }
                </Grid>
            </Grid>
        </div>
    )
}


const VenueCard = (venue) => {
    return makeCard(venue, getVenueInfo(venue), 'venues')
}

export {VenueCard, VenueInfo, getVenueInfo, getVenueGeneralInfo, getBoxOfficeInfo, getVenueAddress};