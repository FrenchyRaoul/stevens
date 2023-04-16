const axios = require('axios');

const authConfig = {
    headers:{
        Authorization: process.env.FOURSQAURE_APIKEY
    }
};

async function getPhotosFromId(fsq_id) {
    if (fsq_id === null) {
        throw new Error("cannot query photos for null fsq_id")
    }
    const getPhotoUrl = `https://api.foursquare.com/v3/places/${fsq_id}/photos`
    const resp = await axios.get(getPhotoUrl, authConfig)
    if (resp && resp.status === 200 && resp.data) {
        return `${resp.data[0]['prefix']}original${resp.data[0]['suffix']}`
    }
    return "/image_not_available.png"
}

async function searchPlaces(queryParams) {
    if (queryParams === null || queryParams === undefined || !Object.entries(queryParams).length) {
        throw new Error("query parameters must be provided to use search api")
    }
    const queryString = Object.entries(queryParams).map(([key, value], _)=>{
        return `${key}=${value}`;
    }).join("&");
    const searchUrl = "https://api.foursquare.com/v3/places/search?" + queryString;
    const resp = await axios.get(searchUrl, authConfig)
    if (resp && resp.status === 200 && resp.data) {
        return resp.data
    }
    throw Error("failed to get axios data")
}

async function getFormattedPlaces(queryParams) {
    const places = await searchPlaces(queryParams);
    console.log(`places result: `, places)
    if (places && places['results']) {
        return places['results'].map(async (place)=>{
            const image = await getPhotosFromId(place['fsq_id']);
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