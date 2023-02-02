const express = require('express');
const router = express.Router();
const users = require('../data/users');
const ingredients = require('../data/ingredients');
const ObjectId = require('mongodb').ObjectID;

router.post('/', async (req, res) => {
    req.session.destination = `/`;
    try {
        const data = req.body;
        if (await users.username_exists(data.username.toLowerCase())) {
            res.sendStatus(403);
            return;
        }
        await users.create(data.username, data.firstName, data.lastName, data.password);
        res.sendStatus(200);
    }
    catch(error) {
        console.log(error);
        res.sendStatus(400)
    }
});

router.get('/', async (req, res) => {
    if (!req.session.authenticated) {
        req.status = 403;
        req.session.error = "You must be logged in to do that.";
        req.session.destination = `/u`;
        res.redirect('/');
        return;
    }
    res.send(await users.getAll());
});

router.get('/create', async (req, res) => {
    res.render('newUser.handlebars', {
        title: "Create a new User!",
    });
});

router.get('/:id', async (req, res) => {
    if (!req.session.authenticated) {
        req.status = 403;
        req.session.error = "You must be logged in to do that.";
        req.session.destination = `/`;
        res.redirect('/');
        return;
    }
    try {
       const id_obj = ObjectId(req.params.id);
       let user = null;
       try {
          user = await users.get(id_obj);
       }
       catch(error) {
          res.sendStatus(403);
          return;
       }
       if (!(user.username === req.session.username)) {
           res.sendStatus(403);
       }
       res.send(user);
    }
    catch(error) {
       console.error(error);
       res.sendStatus(400);
    }
});

router.post('/:id/inventory', async (req, res) => {
    if (!req.session.authenticated) {
        req.status = 403;
        req.session.error = "You must be logged in to update inventory.";
        req.session.destination = `/`;
        res.redirect('/');
        return;
    }
    const username = req.session.username;
    let userid = null;
    let userobj = null;
    try {
       userid = ObjectId(req.params.id);
       userobj = await users.get(userid);
    }
    catch(error) {
        res.sendStatus(404);
        return;
    }
    if (!(userobj.username === username)) {
        // user is trying to update someone else's stuff!
        req.sendStatus(403);
        return;
    }
    let inv_array = req.body.inventory;
    if (!inv_array) inv_array = [];
    if (!(inv_array instanceof Array)) {
        inv_array = new Array(inv_array);
    }
    let inv_obj_array = null;
    try {
        inv_obj_array = inv_array.map(ObjectId);
    }
    catch(error) {
        res.sendStatus(400);
        return;
    }
    for (const ingredient of inv_obj_array) {
        try {
            await ingredients.get(ingredient)
        }
        catch(error) {
            console.log(`bad ingredient, id ${ingredient} does not exist in db`);
            res.sendStatus(404);
            return;
        }
    }
    const inventory = new Set(inv_obj_array);
    await users.updateInventory(userid, inventory);
    res.status(200);
    res.redirect('/private');
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
   const result = await users.remove(id);
   res.sendStatus(200);
});

module.exports = router;