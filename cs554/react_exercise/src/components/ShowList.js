import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams, useNavigate} from 'react-router-dom';
import SearchShows from './SearchShows';
import noImage from '../img/download.jpeg';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
} from '@mui/material';

import '../App.css';

const regex = /(<([^>]+)>)/gi;  // for stripping html characters
const pageRegex = /^\d+$/;

const ShowList = (props) => {
    const {pagenum} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [searchData, setSearchData] = useState(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageNumber, setPageNumber] = useState(pagenum);
    const [pageData, setPageData] = useState({
        showData: undefined,
        previous: false,
        next: false,
    });
    // const [nextExists, setNextExists] = useState(true);
    let card = null;

    useEffect(() => {
        const pageInt = parseInt(pageNumber);
        async function fetchData() {
            try {
                const {data} = await axios.get('http://api.tvmaze.com/shows?page=' + pageNumber);
                let next;
                try {
                    await axios.get('http://api.tvmaze.com/shows?page=' + (pageInt + 1));
                    next = true;
                } catch {
                    next = false;
                }
                setPageData({
                    showData: data,
                    previous: (pageInt > 0),
                    next: next,
                });
                setLoading(false);
            } catch (e) {
                setLoading(false);
                setPageData({
                    showData: undefined,
                    previous: false,
                    next: false,
                });
                console.log(e);
            }
        }

        if (pageRegex.test(pageNumber)) {
            fetchData();
            // checkNext();
        }
    }, [pageNumber]);

    useEffect(() => {
        async function fetchData() {
            try {
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
            pageData && pageData.showData &&
            pageData.showData.map((show) => {
                return buildCard(show);
            });
    }

    const changePage = (page) => {
        navigate(`/shows/page/${page}`);
        setPageNumber(page);
        setLoading(true);
    }

    let firstPage = 'pagelink-disabled';
    let previousPage = ['pagelink-disabled', 0];
    let nextPage = ['pagelink-disabled', 0];
    let cardArea;

    if (!pageRegex.test(pageNumber)) {
        firstPage = 'pagelink';
        cardArea =
            <div>
                <h2>Invalid page number!</h2>
            </div>;
    }

    else if (loading) {
        firstPage = 'pagelink-loading';
        previousPage = ['pagelink-loading', 0];
        nextPage = ['pagelink-loading', 0];
        cardArea = <div>
            <h2>Loading....</h2>
        </div>;
    }

    else if (pageData && !pageData.previous && !pageData.next) {
        firstPage = 'pagelink';
        cardArea = <div>
            <h2>There is no data for this page!</h2>
        </div>;
    }

    else {
        if (!searchTerm) {
            const pageInt = parseInt(pageNumber);
            if (pageData.previous) {
                firstPage = 'pagelink';
                previousPage = ['pagelink', pageInt - 1];
            }
            if (pageData.next) {
                nextPage = ['pagelink', pageInt + 1];
            }
        }
        cardArea = <Grid
            container
            spacing={2}
            sx={{
                flexGrow: 1,
                flexDirection: 'row'
            }}
        >
            {card}
        </Grid>
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
            {cardArea}
        </div>
    );
}

export default ShowList;
