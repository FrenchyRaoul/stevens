import React from 'react';
import {Link} from "react-router-dom";

import '../App.css';

const PageNav = (props)=>{
    return (
        <div className='PageNav'>
            <nav>
                <Link className='showlink' to={props.pages.firstPage} onClick={()=> {props.pages.setPage(0)}}>
                    First Page
                </Link>
                <Link className='showlink' to={props.pages.previousPage.url} onClick={()=> {props.pages.setPage(props.pages.previousPage.page)}}>
                    Previous Page
                </Link>
                <Link className='showlink' to={props.pages.nextPage.url} onClick={()=> {props.pages.setPage(props.pages.nextPage.page)}}>
                    Next Page
                </Link>
                <Link className='showlink' to={props.pages.lastPage.url} onClick={()=> {props.pages.setPage(props.pages.lastPage.page)}}>
                    Last Page
                </Link>
            </nav>
        </div>
    );
}

export default PageNav;