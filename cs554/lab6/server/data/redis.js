const redis = require('redis');
const client = redis.createClient();

const characterHashKey = "characters";
const pageHashKey = "characterPage";

client.on('connect', function () {
    console.log('Redis connected!');
});

client.on("error", (err) => {
        console.log(`Redis error: ${err}`);
    }
)

async function getRedis() {
    if (!client.isOpen) await client.connect();
    return client
}


async function checkPageCache(pageNumber) {
    const client = await getRedis();
    return await client.hExists(pageHashKey, pageNumber);
}


async function checkCharacterCache(characterId) {
    const client = await getRedis();
    return await client.hExists(characterHashKey, characterId);
}

async function cachePage(pageNumber, pageData) {
    const client = await getRedis();
    return await client.hSet(pageHashKey, pageNumber, JSON.stringify(pageData))
}


async function cacheCharacter(character) {
    const client = await getRedis();
    return await client.hSet(characterHashKey, character['id'], JSON.stringify(character))
}


async function getCachedPage(pageNumber) {
    const client = await getRedis();
    if (!await checkPageCache(pageNumber)) {
        throw `page ${pageNumber} does not exist in cache`;
    }
    return JSON.parse(await client.hGet(pageHashKey, pageNumber))
}


async function getCachedCharacter(characterId) {
    const client = await getRedis();
    if (!await checkCharacterCache(characterId)) {
        throw "character does not exist in cache";
    }
    return JSON.parse(await client.hGet(characterHashKey, characterId))
}

module.exports = {
    checkCharacterCache,
    cacheCharacter,
    getCachedCharacter,
    checkPageCache,
    cachePage,
    getCachedPage,
}