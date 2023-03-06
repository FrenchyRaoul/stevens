import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams, useNavigate} from 'react-router-dom';
import SearchShows from './SearchShows';
import noImage from '../img/download.jpeg';
import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
} from '@mui/material';

import '../App.css';

const ShowList = (props) => {
    const {page} = useParams();
    const navigate = useNavigate();
    console.log(`my params: ${JSON.stringify(page)}`);
    const regex = /(<([^>]+)>)/gi;  // for stripping html characters
    const pageRegex = /^\d+$/;
    const [loading, setLoading] = useState(true);
    const [searchData, setSearchData] = useState(undefined);
    const [showsData, setShowsData] = useState(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageNumber, setPageNumber] = useState(page);
    const [nextExists, setNextExists] = useState(true);
    let card = null;

    useEffect(() => {
        console.log('on load/page change useeffect');
        async function fetchData() {
            try {
                const {data} = await axios.get('http://api.tvmaze.com/shows?page=' + pageNumber);
                // const {data} = await axios.get('http://api.tvmaze.com/shows');
                setShowsData(data);
                console.log(`loaded ${data.length} shows`);
                setLoading(false);
            } catch (e) {
                setLoading(false);
                setShowsData([]);
                console.log(e);
            }

            const pageInt = parseInt(pageNumber);
            const next = pageInt + 1;
            try {
                await axios.get('http://api.tvmaze.com/shows?page=' + next);
                setNextExists(true);
            } catch {
                setNextExists(false);
            }

        }

        // async function checkNext() {
        //     const pageInt = parseInt(pageNumber);
        //     const next = pageInt + 1;
        //     try {
        //         await axios.get('http://api.tvmaze.com/shows?page=' + next);
        //         setNextExists(true);
        //     } catch {
        //         setNextExists(false);
        //     }
        // }

        if (pageRegex.test(pageNumber)) {
            fetchData();
            // checkNext();
        }
    }, [pageNumber]);

    useEffect(() => {
        console.log('search useEffect fired');
        async function fetchData() {
            try {
                console.log(`in fetch searchTerm: ${searchTerm}`);
                const {data} = await axios.get(
                    'http://api.tvmaze.com/search/shows?q=' + searchTerm
                );
                setSearchData(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        if (searchTerm) {
            console.log('searchTerm is set');
            fetchData();
        }
    }, [searchTerm]);

    const searchValue = async (value) => {
        setSearchTerm(value);
    };
    const buildCard = (show) => {
        return (
            <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={show.id}>
                <Card
                    variant='outlined'
                    sx={{
                        maxWidth: 250,
                        height: 'auto',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        borderRadius: 5,
                        border: '1px solid #1e8678',
                        boxShadow:
                            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                    }}
                >
                    <CardActionArea>
                        <Link to={`/shows/${show.id}`}>
                            <CardMedia
                                sx={{
                                    height: '100%',
                                    width: '100%'
                                }}
                                component='img'
                                image={
                                    show.image && show.image.original
                                        ? show.image.original
                                        : noImage
                                }
                                title='show image'
                            />

                            <CardContent>
                                <Typography
                                    sx={{
                                        borderBottom: '1px solid #1e8678',
                                        fontWeight: 'bold'
                                    }}
                                    gutterBottom
                                    variant='h6'
                                    component='h3'
                                >
                                    {show.name}
                                </Typography>
                                <Typography variant='body2' color='textSecondary' component='p'>
                                    {show.summary
                                        ? show.summary.replace(regex, '').substring(0, 139) + '...'
                                        : 'No Summary'}
                                    <span>More Info</span>
                                </Typography>
                            </CardContent>
                        </Link>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    };

    if (searchTerm) {
        card =
            searchData &&
            searchData.map((shows) => {
                let {show} = shows;
                return buildCard(show);
            });
    } else {
        card =
            showsData &&
            showsData.map((show) => {
                return buildCard(show);
            });
    }

    if (!pageRegex.test(pageNumber)) {
        console.log("got a bad page number");
        return (
            <div>
                <h2>Invalid page number!</h2>
            </div>
        )
    }

    const changePage = (page) => {
        navigate(`/shows/page/${page}`);
        setPageNumber(page);
    }

    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
    } else {
        // genereate next/previous links
        const pageInt = parseInt(pageNumber);
        let firstPage = 'pagelink';
        let previousPage;
        let nextPage;
        if (!searchTerm) {
            if (pageInt === 0) {
                previousPage = ['pagelink-disabled', 0];
                firstPage = 'pagelink-disabled';
            } else {
                previousPage = ['pagelink', pageInt - 1]
            }
            if (nextExists) {
                nextPage = ['pagelink', pageInt + 1];
            }
            else {
                nextPage = ['pagelink-disabled', 0]
            }
        }

        return (
            <div>
                <SearchShows searchValue={searchValue} />
                <br />
                <br />
                <button className={firstPage} onClick={() => changePage(0)} >First Page</button>
                <button className={previousPage[0]} onClick={() => changePage(previousPage[1])}>Previous Page</button>
                <button className={nextPage[0]} onClick={() => changePage(nextPage[1])}>Next Page</button>
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
                    {card}
                </Grid>
            </div>
        );
    }
};

export default ShowList;
