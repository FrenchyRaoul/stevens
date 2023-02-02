const express = require('express');
const router = express.Router();
const path = require("path");
const getPerson = require('../data/people').getPerson;

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (isNaN(id)) {
        res.status(400);
        res.render(path.resolve('views/error.handlebars'), {
            error: "Error: ID was not an integer",
            title: "Error"
        });
        return;
    }
    try {
        const person = await getPerson(id);
        res.render(path.resolve('views/details.handlebars'), {
            person: person,
            title: "Person Found"
        })
    }
    catch {
        res.status(404);
        res.render(path.resolve('views/error.handlebars'), {
            error: "Error: ID was not found",
            title: "Error"
        });
    }
});

module.exports = router;
