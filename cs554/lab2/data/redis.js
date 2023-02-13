const redis = require('redis');
const client = redis.createClient();

const recipeCacheKey = "recipes"
const hitCountKey = "accessCount";


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

module.exports = {recipeCacheKey, hitCountKey, getRedis}