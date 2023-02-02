const express = require('express');
const router = express.Router();
const path = require("path");
const searchPeople = require('../data/people').searchPeople;

router.post('/', async (req, res) => {
    let searchData = req.body;
    const personName = searchData.personName;
    if (!personName) {
        res.status(400);
        res.render(path.resolve('views/error.handlebars'), {
            error: "Error: Search form was empty",
            title: "Error"
        })
    }
    else {
        const people = await searchPeople(personName);
        if (people.length === 0) {
            res.render(path.resolve('views/noResults.handlebars'), {
                people: people,
                personName: searchData.personName,
                title: "No Results"
            })
        } else {
            res.render(path.resolve('views/search.handlebars'), {
                people: people,
                personName: searchData.personName,
                title: "People Found"
            })
        }
    }
});

module.exports = router;
