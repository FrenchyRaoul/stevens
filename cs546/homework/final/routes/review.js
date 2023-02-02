const express = require('express');
const router = express.Router();
const reviews = require('../data/reviews');
const ObjectId = require('mongodb').ObjectID;

router.post('/', async (req, res) => {
    const data = req.body;
    let body = data.body;
    if (!body) body = '';
    const recipeid = ObjectId(data.recipeid);
    if (!req.session.authenticated) {
        req.status = 403;
        req.session.error = "You must be logged in to post a comment.";
        req.session.destination = `/r/${recipeid}`;
        res.redirect('/');
        return;
    }
    const userid = ObjectId(data.userid);
    const rating = parseInt(data.rating);
    if (!([1, 2, 3, 4, 5].includes(rating))) throw "rating must be an integer 1-5";
    try {
        await reviews.create(userid, recipeid, body, rating);
        res.redirect(`/r/${recipeid}`);
    }
    catch(error) {
        console.log(error);
        res.sendStatus(400)
    }
});

router.get('/', async (req, res) => {
    res.send(await reviews.getAll());
});

router.delete('/:id', async (req, res) => {
    let id = null;
    try {
        id = ObjectId(req.params.id);
    }
    catch(error) {
        console.error(error);
        res.sendStatus(400);
    }
    try {
        await reviews.remove(id);
        res.sendStatus(200);
    }
    catch(error) {
        console.log(error);
        res.sendStatus(400);
    }
});

module.exports = router;