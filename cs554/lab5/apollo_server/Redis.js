const { createClient } = require('redis');

const client = createClient();
const locationKey = "locations"

client.on('connect', function () {
    console.log('Redis connected!');
});

client.on("error", (err) => {
        console.log(`Redis error: ${err}`);
        throw Error("redis connection error; did you forget to start redis?")
    }
)

async function getRedis() {
    if (!client.isOpen) await client.connect();
    return client
}


async function getLocation(id) {
    const redis = await getRedis();
    const raw = await redis.hGet(locationKey, id)
    if (raw === null || raw === undefined) {
        throw Error(`no location found for id ${id}`)
    }
    return JSON.parse(raw)
}


async function uploadLocation(location) {
    // This mutation will create a Location and will be saved in Redis. Outside of the provided values from the
    // “New Location” form, by default, the following values of Location should be:
    // liked: false
    // userPosted: true
    // id: a uuid
    const redis = await getRedis();
    try {
        await redis.hSet(locationKey, location['id'], JSON.stringify(location))
    } catch(e) {
        throw Error(`something went wrong; nothing added to cache: `, e)
    }
    return location
}


async function getCachedIds() {
    const redis = await getRedis();
    return await redis.hKeys(locationKey);
}


async function getLikedLocations() {
    const redis = await getRedis();
    const data = await redis.hGetAll(locationKey)
    console.log(`found like data: `, data);
    return Object.values(data).filter((raw_entry)=>{
        const entry = JSON.parse(raw_entry);
        return entry.liked
    }).map(JSON.parse)
}

async function getUserLocations() {
    const redis = await getRedis();
    const data = await redis.hGetAll(locationKey)
    return Object.values(data).filter((raw_entry)=>{
        const entry = JSON.parse(raw_entry);
        return entry.userPosted
    }).map(JSON.parse)
}

async function deleteLocation(id) {
    const redis = await getRedis();
    let location = JSON.parse(await redis.hGet(locationKey, id));
    let result = await redis.hDel(locationKey, id);
    console.log(`result: `, result)
    if (result !== 1) {
        throw Error("something went wrong; nothing deleted from cache")
    }
    return location
}

module.exports = { getLocation, uploadLocation, deleteLocation, getLikedLocations, getUserLocations, getCachedIds}