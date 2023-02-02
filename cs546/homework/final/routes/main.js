const express = require('express');
const bcrypt = require('bcrypt');
const users = require('../data/users');
const recipes = require('../data/recipes');
const ingredients = require('../data/ingredients');
const router = express.Router();
const salt = require('../config').salt;

router.get('/', async (req, res, next) => {
    // if not authenticated
    if (!req.session.authenticated) {
        res.render('login_page.handlebars', {
            title: 'Log In',
            error: req.session.error,
        });
        req.session.error = null;
    }
    else {
        res.redirect('/private');
    }
});


router.get('/private', async (req, res) => {
    if (!req.session.authenticated) {
        req.status = 403;
        req.session.error = "You must be logged in to access that page";
        res.redirect('/');
    }
    else {
        let user = null;
        try {
            user = await users.get_username(req.session.username);
        }
        catch(error) {
            console.log("we should never hit this error. user is authenticated but not found?");
            res.sendStatus(500);
            return;
        }

        const inv_strings = user.inventory.map(obj => {return obj.toString()});
        const recipe_selections = await recipes.recipeRankFromInventory(new Set(inv_strings));

        const ingredient_list = await ingredients.getAll();
        for (const ingredient of ingredient_list) {
            ingredient.clean_name = ingredient.name.replace(/\s/g, '_');
            if (inv_strings.includes(ingredient._id.toString())) {
                ingredient.checked = true;
            }
        }

        res.render('private.handlebars', {
            title: `${user.username} Info`,
            user: user,
            recipes: recipe_selections,
            ingredients: ingredient_list
        });
    }
    // get user information from cookie
    //display user information (except password)
});


router.post('/login', async (req, res, next) => {
   // get username and password from form
    let user = null;

    try {
        user = await users.get_username(req.body.username);
    }
    catch(error) {
        console.log(error);
        // attacker could user the fast response time of this redirect to discover user names, so spend time hashing
        bcrypt.hashSync('foobar', salt);
        req.session.error = "Username or password is incorrect";
        res.redirect('/');
        return;
    }
    // find record containing username
    const real_hash = user.hashedPassword;

    // hash the attempted password
    const attempt_hash = bcrypt.hashSync(req.body.password, salt);

    // check if password matches password from record
    if (attempt_hash === real_hash) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 0.5); // 30 min expiry

        req.session.username = user.username;
        req.session.authenticated = true;

        let destination = null;
        if (req.session.destination) {
            destination = req.session.destination;
            req.session.destination = null
        }
        else {
            destination = '/private'
        }
        res.redirect(destination);
    }
    else  {
        res.status = 401;
        req.session.error = "Username or password is incorrect";
        res.redirect('/');
    }
});

router.get('/logout', async (req, res, next) => {
    req.session.destroy();
    res.render('logout.handlebars', {title: "Logging Out..."});
});

module.exports = router;
