const express = require('express');
const router = express.Router();
const ingredients = require('../data/ingredients');
const recipes = require('../data/recipes');
const ObjectId = require('mongodb').ObjectID;

router.get('/create', async (req, res) => {
   if (!req.session.authenticated) {
      req.status = 403;
      req.session.error = "You must be logged in to access that page";
      req.session.destination = '/i/create';
      res.redirect('/');
   }
   else {
      res.render('newIngredient.handlebars', {title: "Create a new ingredient!"})
   }
});

router.post('/', async (req, res) => {
   if (!req.session.authenticated) {
      req.status = 403;
      req.session.error = "You must be logged in to access that page";
      req.session.destination = '/i/create';
      res.redirect('/');
   }
   else {
      const data = req.body;
      let categories = data.categories;
      let abv = data.abv;

      if (!categories) categories = '';
      categories = categories.split(" ");
      if (!abv) abv = 0;
      await ingredients.create(data.ingredient_name, data.type, categories, abv);
      res.status(200);
      res.redirect('/');
   }
});

router.get('/', async (req, res) => {
   res.send(await ingredients.getAll())
});

router.get('/:id', async (req, res) => {
   try {
      const id_obj = ObjectId(req.params.id);
      try {
          const ingredient = await ingredients.get(id_obj);
          const recipe_list = await recipes.getRecipesContainingIngredient(id_obj);
          res.render('recipes.handlebars', {
             'title': `Recipes with ${ingredient.name}`,
             'ingredient': ingredient.name,
             'recipes': recipe_list
          })
      }
      catch(error) {
         console.log(error);
         res.sendStatus(404);
      }
   }
   catch(error) {
      console.error(error);
      res.sendStatus(400);
   }
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
      await ingredients.remove(id);
      res.sendStatus(200);
   }
   catch(error) {
      res.sendStatus(400);
   }
});

module.exports = router;