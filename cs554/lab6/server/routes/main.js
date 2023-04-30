const express = require('express');
const router = express.Router();
const {getMarvelCharacters, getCharacter, checkMoreCharacters} = require('../data');
const {checkCharacterCache, cacheCharacter, getCachedCharacter, checkPageCache, cachePage, getCachedPage} = require("../data/redis");
// const store = require('../store');
// const actions = require('../actions');

async function tryGetCachedCharacter(req, res, next) {
    const characterId = req.params.id;
    if (characterId === null) {
        res.status(400).json({'error': "no character id found"})
        return
    }
    if (await checkCharacterCache(characterId)) {
        const character = await getCachedCharacter(characterId)
        res.json(character)
    } else {
        next()
    }
}

async function tryGetCachedPage(req, res, next) {
    const pageNumber = req.params.pagenum;
    if (pageNumber === null) {
        res.status(400).json({'error': "no page number found"})
        return
    }
    if (await checkPageCache(pageNumber)) {
        const pageData = await getCachedPage(pageNumber)
        console.log(`page data: `, typeof pageData)
        res.json(pageData)
        console.log("found cached page")
    } else {
        console.log("page not found in cache")
        next()
    }
}

router.get('/marvel-characters/page/:pagenum', [tryGetCachedPage, async (req, res) => {
    const pageNumber = parseFloat(req.params.pagenum);
    if ((!(Number.isInteger(pageNumber))) || (pageNumber < 0)) {
        res.status(400).json({'error': 'invalid page number; page number must be a positive integer'});
        return;
    }
    const characterData = await getMarvelCharacters(pageNumber);
    const moreCharacters = await checkMoreCharacters(pageNumber)
    if (characterData['data']['count'] === 0) {
        res.status(404).json({'error': 'no characters found'});
        return;
    }
    const result = {
        'results': characterData['data']['results'],
        'more': moreCharacters
    }
    res.json(result)
    cachePage(pageNumber, result)
}])

router.get('/character/:id', [tryGetCachedCharacter, async (req, res) => {
    const character_id = req.params.id;

    try {
        const data = await getCharacter(character_id);
        res.json(data)
        cacheCharacter(data)
    } catch(e) {
        res.status(404).json({'error': 'no character found'})
    }
}])


module.exports = router;