const express = require('express');
const {createUser, login, getUserByUsername} = require("../data/users");
const router = express.Router();


router.post('/signup', async (req, res) => {
    // if a user is already logged in
    if (req.session.user) {
        res.status(400).json({"error": "a user is already logged in"})
        return
    }

    try {
        const {name, username, password} = req.body;
        const user = await createUser(name, username, password);
        res.json(user)
    } catch (e) {
        res.status(400).json({"error": e})
    }
})


router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    // if a user is already logged in
    if (req.session.user) {
        res.status(400).json({"error": "a user is already logged in"})
    }
    else {
        // otherwise, attempt to log in
        try {
            const userObject = await login(username, password);
            req.session.user = { "username": userObject.username, "userId": userObject._id }
            res.json({ "username": userObject.username, "userId": userObject._id })
        } catch (e) {
            res.status(401).json({"error": e})
        }
    }
})


router.get('/logout', async (req, res) => {
    if (!req.session.user) {
        res.status(400).json({"error": "you are not currently logged in"})
        return
    }
    req.session.destroy()
    res.json({"logout": true})
})


module.exports = router;