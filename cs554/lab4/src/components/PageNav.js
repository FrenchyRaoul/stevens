import React from 'react';
import {Link, useParams} from "react-router-dom";

import '../App.css';
import {Input} from "@mui/material";

const PageNav = (props)=>{

    const page = Number(useParams()['page'])
    const morePages = (page < props.pages.maxPage) ? 'navlink' : 'navlink-disabled';
    const lessPages = (page > 1) ? 'navlink' : 'navlink-disabled';

    function getUrl(page) {
        return `${props.pages.baseUrl}/${page}`
    }

    async function setSearchTerm(event) {
        console.log("running search in pageNave");
        console.log(event);
        props.searchFunc(event.target.value)
        console.log(event.target.value);
    }

    return (
        <div className='PageNav'>
            <nav>
                <Link className={lessPages} to={getUrl(1)} onClick={()=> {props.pages.setPage(1)}}>
                    First Page
                </Link>
                <Link className={lessPages} to={getUrl(page - 1)} onClick={()=> {props.pages.setPage(page - 1)}}>
                    Previous Page
                </Link>
                <Link className={morePages} to={getUrl(page + 1)} onClick={()=> {props.pages.setPage(page + 1)}}>
                    Next Page
                </Link>
                <Link className={morePages} to={getUrl(props.pages.maxPage)} onClick={()=> {props.pages.setPage(props.pages.maxPage)}}>
                    Last Page
                </Link>
                <br />
                <Input className='search' placeholder='search...' type='search' onChange={setSearchTerm} />
            </nav>
        </div>
    );
}

export default PageNav;