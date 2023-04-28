const axios = require('axios');
const md5 = require('blueimp-md5');

const charactersPerPage = 20;


function getAPIHash(ts){
    const publickey = process.env.MARVEL_PUBLIC;
    const privatekey = process.env.MARVEL_PRIVATE;
    const stringToHash = ts + privatekey + publickey;
    return md5(stringToHash);
}


function getCharacterPageUrl(pageNumber) {
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
    const offset = pageNumber * charactersPerPage;
    const publickey = process.env.MARVEL_PUBLIC;
    const ts = new Date().getTime();
    const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + getAPIHash(ts) + "&offset=" + offset;
    console.log(`character page url: `, url);
    return url
}


function getCharacterUrl(id) {
    const baseUrl = `https://gateway.marvel.com:443/v1/public/characters/${id}`;
    const publickey = process.env.MARVEL_PUBLIC;
    const ts = new Date().getTime();
    const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + getAPIHash(ts)
    console.log(`character url: `, url);
    return url
}

async function getMarvelCharacters(pageNumber) {
    const rawData = await axios.get(getCharacterPageUrl(pageNumber));
    return rawData['data']
}

async function getCharacter(id) {
    const rawData = await axios.get(getCharacterUrl(id));
    return rawData['data']
}

module.exports = {getMarvelCharacters, getCharacter};