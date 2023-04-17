const axios = require('axios');

const authConfig = {
    headers:{
        Authorization: process.env.FOURSQAURE_APIKEY
    }
};

const pageLinks = {};

async function getPhotosFromId(fsq_id) {
    if (fsq_id === null) {
        throw new Error("cannot query photos for null fsq_id")
    }
    const getPhotoUrl = `https://api.foursquare.com/v3/places/${fsq_id}/photos`
    const resp = await axios.get(getPhotoUrl, authConfig)
    if (resp && resp.status === 200 && resp.data) {
        return `${resp.data[0]['prefix']}original${resp.data[0]['suffix']}`
    } else {
        throw Error("failed to query photo")
    }
}

function getCursorLink(response) {
    const linkHeader = response && response['headers'] && response['headers']['link']
    if (linkHeader) {
        return linkHeader.split('>')[0].slice(1);
    }
    throw Error("no 'next page' cursor found in headers")
}

async function searchPlaces(queryParams, pageNum) {
    if (queryParams === null || queryParams === undefined || !Object.entries(queryParams).length) {
        throw new Error("query parameters must be provided to use search api")
    }
    let currentPage = 1;
    const page = pageNum ? pageNum : 1

    if (!pageLinks[1]) {
        const queryString = Object.entries(queryParams).map(([key, value], _)=>{
            return `${key}=${value}`;
        }).join("&");
        pageLinks[1] = "https://api.foursquare.com/v3/places/search?" + queryString;
    }
    let data;
    while (currentPage <= page) {
        const searchUrl = pageLinks[currentPage]
        const resp = await axios.get(searchUrl, authConfig)
        if (resp && resp.status === 200 && resp.data) {
            pageLinks[currentPage + 1] = getCursorLink(resp);
            data = resp.data;
            currentPage += 1;
        } else {
            throw Error("failed to get axios data")
        }
    }
    return data;
}

async function getFormattedPlaces(queryParams, pageNum) {
    const places = await searchPlaces(queryParams, pageNum);
    if (places && places['results']) {
        return places['results'].map(async (place)=>{
            let image;
            try {
                image = await getPhotosFromId(place['fsq_id']);
            } catch(e) {
                console.log(`failed to get image for ${place['fsq_id']}: ${e}`);
                image = "NO IMAGE AVAILABLE";
            }
            return {
                id: place['fsq_id'],
                image: image,
                name: place['name'],
                address: place['location']['formatted_address'],
                userPosted: false,
                liked: false
            }
        })
    }
    throw Error("did not find any places")
}

module.exports = {getFormattedPlaces}