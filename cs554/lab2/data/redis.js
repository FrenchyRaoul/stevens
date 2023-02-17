const redis = require('redis');
const client = redis.createClient();

const recipeCacheKey = "recipes"
const hitCountKey = "accessCount";
const authCookieName = "redisAuthCookie";
const sessionTimeout = 172800; // seconds. 2 days = 60 * 60 * 24 * 2 = 172800

function getSessionKey(sessionId) {
    return `session:${sessionId}`;
}

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


async function createSession(sessionId, user) {
    if (sessionId === undefined) throw "cannot create a session with no sessionId";
    if (user === undefined) throw "cannot create a session without a user";
    const client = await getRedis();
    await client.set(getSessionKey(sessionId), JSON.stringify(user), {"EX": sessionTimeout});
}

async function refreshSession(request) {
    if (await checkLoggedIn(request)) {
        const sessionId = request.cookies[authCookieName];
        const client = await getRedis();
        await client.expire(getSessionKey(sessionId), sessionTimeout);
    } else throw "user is not logged in";
}

async function destroySession(sessionId) {
    if (sessionId === undefined) throw "cannot create a session with no sessionId";
    const client = await getRedis();
    await client.expire(getSessionKey(sessionId), 0);
}

async function getUserForSessionId(sessionId) {
    if (sessionId === undefined) throw "session id must be defined";
    const client = await getRedis();
    const user = JSON.parse(await client.get(getSessionKey(sessionId)));
    if (user === null) throw "sessionId not found";
    return user;
}

async function checkLoggedIn(request) {
    if (request === undefined) throw "request object must be defined"
    if (request.cookies === undefined) return false

    const sessionId = request.cookies[authCookieName];
    try {
        await getUserForSessionId(sessionId);
        return true
    } catch {
        return false
    }
}

module.exports = {
    recipeCacheKey, hitCountKey, authCookieName, getRedis, createSession, destroySession, checkLoggedIn,
    getUserForSessionId, refreshSession
}