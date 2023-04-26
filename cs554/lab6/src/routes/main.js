const express = require('express');
const router = express.Router();
const store = require('../store');
const actions = require('../actions');


router.get('/marvel-characters/page/:pagenum', async (req, res) => {
    res.sendStatus(200).send("character page route")
})

router.get('/character/:id', async (req, res) => {
    res.sendStatus(200).send("character page route")
})

router.get('/', async (req, res) => {
    store.subscribe(()=>{
        console.log(`state changed: `, store.getState())
    })
    store.dispatch(actions.changeLocation("new location"))
    res.sendStatus(200).send("successfully hit route")
})