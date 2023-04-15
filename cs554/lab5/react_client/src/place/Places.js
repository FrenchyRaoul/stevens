import axios from 'axios';

const PAGE_SIZE = 25;

const authConfig = {
    headers:{
        Authorization: process.env.REACT_APP_TM_APIKEY
    }
};

async function getPhotosFromId(fsq_id) {
    if (fsq_id === null) {
        throw new Error("cannot query photos for null fsq_id")
    }
    const photoUrl = `https://api.foursquare.com/v3/places/${fsq_id}/photos`
    return await axios.get(photoUrl, authConfig)
}

async function searchPlaces(queryParams) {
    if (queryParams === null || !queryParams.entries.length) {
        throw new Error("query parameters must be provided to use search api")
    }
    const queryString = queryParams.entries.map((key, value)=>{
        return `${key}=${value}`
    }).join("&");
    const searchUrl = "https://api.foursquare.com/v3/places/search?" + queryString;
    return await axios.get(searchUrl, authConfig)
}


export {
    getPhotosFromId
}