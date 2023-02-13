const crypto = require('crypto');
const express = require('express');
const {createUser, login} = require("../data/users");
const router = express.Router();
const {
    recipeCacheKey, hitCountKey, authCookieName, getRedis, createSession, destroySession, checkLoggedIn
} = require('../data/redis')


async function generateSessionId() {
    return crypto.randomUUID();
}


async function enforceNotLoggedIn(req, res, next) {
    if (await checkLoggedIn(req)) {
        res.status(400).json({"error": "a user is already logged in"})
        return
    }
    next()
}

router.post('/signup', [enforceNotLoggedIn, async (req, res) => {
    try {
        const {name, username, password} = req.body;
        const user = await createUser(name, username, password);
        res.json(user)
    } catch (e) {
        res.status(400).json({"error": e})
    }
}])


router.post('/login', [enforceNotLoggedIn, async (req, res) => {
    const {username, password} = req.body;
    try {
        const userObject = await login(username, password);
        const sessionId = await generateSessionId();
        const user = {"username": userObject.username, "userId": userObject._id};
        await createSession(sessionId, user);
        res.cookie(authCookieName, sessionId);
        res.json(user);
    } catch (e) {
        res.status(401).json({"error": e})
    }
}])


router.get('/logout', async (req, res) => {
    if (!(await checkLoggedIn(req))) {
        res.status(400).json({"error": "you are not currently logged in"})
        return
    }
    await destroySession(req.cookies[authCookieName]);
    res.json({"logout": true})
})


router.get('/mostaccessed', async (req, res) => {
    try {
        const client = await getRedis();
        const recipeIds = (await client.zRange(hitCountKey, 0, -1, {
            "REV": true,
            "BYSCORE": true,
        })).slice(0, 10);
        const recipes = (await client.hmGet(recipeCacheKey, recipeIds)).map(JSON.parse);
        res.json(recipes);
    } catch (e) {
        res.status(500).json({"error": e});
    }
})


module.exports = router;