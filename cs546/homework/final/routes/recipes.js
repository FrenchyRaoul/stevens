const express = require('express');
const router = express.Router();
const users = require('../data/users');
const recipes = require('../data/recipes');
const reviews = require('../data/reviews');
const ingredients = require('../data/ingredients');
const ObjectId = require('mongodb').ObjectID;

//function makeIngredientsObjectIDs(ingredient_array) {
//    return ingredient_array.map((obj) => {
//        return {
//            id: ObjectId(obj.id),
//            quantity: obj.quantity
//        }
//    });
//}

router.post('/', async (req, res) => {
    if (!req.session.authenticated) {
        req.status = 403;
        req.session.error = "You must be logged in to access that page";
        req.session.destination = '/r/create';
        res.redirect('/');
    }
    else {
        const data = req.body;
        const steps = data.steps.split("\n");
        const ingredient_array = [];
        for (const ingredient_id of data.ingredients) {
            ingredient_array.push({
                id: ObjectId(ingredient_id),
                quantity: data[`${ingredient_id}-quantity`]
            })
        }
        await recipes.create(data.name, ingredient_array, steps, "");
        res.status(200);
        res.redirect('/');
    }
});

router.get('/create', async (req, res) => {
    if (!req.session.authenticated) {
        req.status = 403;
        req.session.error = "You must be logged in to access that page";
        req.session.destination = '/r/create';
        res.redirect('/');
    }
    else {
        const ingredient_list = await ingredients.getAll();
        for (const ingredient of ingredient_list) {
            ingredient.clean_name = ingredient.name.replace(/\s/g, "_");
        }
        res.render('newRecipe.handlebars', {
            title: "Create a new recipe!",
            ingredients: ingredient_list
        })
    }
});

router.get('/', async (req, res) => {
    const all_recipes = await recipes.getAll();
    res.render('recipes', {
        title: 'All Recipes',
        recipes: all_recipes
    })
});

router.get('/:id', async (req, res, next) => {
    const recipe_obj = ObjectId(req.params.id);
    let recipe = null;
    try {
        recipe = await recipes.get(recipe_obj);
    }
    catch(error) {
        res.sendStatus(404);
        return
    }

    const ingredient_list = [];
    for (const ingredient of recipe.ingredients) {
        const ingredient_obj = await ingredients.get(ingredient.id);
        ingredient_obj.quantity = ingredient.quantity;
        ingredient_list.push(ingredient_obj)
    }

    const isAuth = req.session.authenticated;
    let user = null;
    if (isAuth) {
        const username = req.session.username;
        user = await users.userFromUsername(username);
    }

    // add the usernames back to the reviews
    const comments = await reviews.getReviewsForRecipe(recipe_obj);
    for (let review of comments) {
        review.username = (await users.get(review.userid)).username;
    }

    let rating_sum = 0;
    for (const review of comments) {
        rating_sum += review.rating;
    }

    let rating = 0;
    if (comments.length > 0) {
        rating = Math.round(rating_sum / comments.length);
    }

    recipe.rating = rating;
    recipe.reviews = comments.length;

    if (!(recipe.pic)) recipe.pic = 'generic.png';

    res.render('recipe.handlebars', {
        title: recipe.name,
        user: user,
        comments: comments,
        recipe: recipe,
        ingredients: ingredient_list
    })

});
module.exports = router;