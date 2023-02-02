const express = require('express');
const router = express.Router();
const path = require('path')

router.get('/', async (req, res) => {
    res.sendFile(path.resolve('main.html'))
});

const constructorMethod = app  => {
    app.use("/", router);

    app.use("*", (req,res) => {
        res.sendStatus(404)
    })
};

module.exports = constructorMethod;
