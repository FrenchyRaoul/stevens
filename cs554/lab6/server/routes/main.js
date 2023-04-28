const express = require('express');
const router = express.Router();
const {getMarvelCharacters, getCharacter} = require('../data');
// const store = require('../store');
// const actions = require('../actions');

async function getCachedCharacter(req, res, next) {
    console.log('running middleware');
    const character_id = req.params.id;
    console.log(`character id: `, character_id)
    console.log(await getCharacter(character_id))
    // const client = await getRedis();
    // let cacheVal = await client.hGet(recipeCacheKey, req.params.id);
    // if (cacheVal !== null) {
    //     const data = JSON.parse(cacheVal);
    //     res.json(data);
    //     await client.zIncrBy(hitCountKey, 1, req.params.id);
    //     return
    // }
    next()
}

router.get('/marvel-characters/page/:pagenum', async (req, res) => {
    const pageNumber = parseFloat(req.params.pagenum);
    if ((!(Number.isInteger(pageNumber))) || (pageNumber < 0)) {
        res.status(400).json({'error': 'invalid page number; page number must be a positive integer'});
        console.log(Number.isInteger(pageNumber));
        console.log(pageNumber < 0);
        return;
    }
    const characterData = await getMarvelCharacters(pageNumber);
    if (characterData['data']['count'] === 0) {
        res.status(404).json({'error': 'no characters found'});
        return;
    }
    res.json({'results': characterData['data']['results']})
})

router.get('/character/:id', [getCachedCharacter, async (req, res) => {
    const character_id = req.params.id;
    res.json({'result': `character page route: ${character_id}`})
}])


module.exports = router;