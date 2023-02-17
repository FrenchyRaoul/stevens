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
        await createSession(sessionId, userObject);
        res.cookie(authCookieName, sessionId);
        res.json(userObject);
    } catch (e) {
        res.status(401).json({"error": e});
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

// router.get('/mostaccessed', async (req, res) => {
//     try {
//         const client = await getRedis();
//         const recipeIds = (await client.zRange(hitCountKey, 0, -1, {
//             "REV": true,
//             "BYSCORE": true,
//         })).slice(0, 10);
//         const recipes = (await client.hmGet(recipeCacheKey, recipeIds)).map(JSON.parse);
//         res.json(recipes);
//     } catch (e) {
//         res.status(500).json({"error": e});
//     }
// })

router.get('/mostaccessed', async (req, res) => {
    const max_results = 2;
    try {
        const client = await getRedis();
        const results = (await client.sendCommand(["ZRANGE", hitCountKey, "0", "-1", "REV", "WITHSCORES"])).slice(0, max_results * 2);
        let ids = [];
        let hits = [];
        results.forEach((value, index) => {
            (index % 2 === 0) ? ids.push(value) : hits.push(value);
        })
        const recipes = (await client.hmGet(recipeCacheKey, ids)).map(JSON.parse);
        recipes.forEach((recipe, index) => {
            recipe['hits'] = hits[index];
        })
        res.json(recipes);
    } catch (e) {
        res.status(500).json({"error": e});
    }
})


module.exports = router;