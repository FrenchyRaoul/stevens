const collections = require("./collections");
const ObjectId = require('mongodb').ObjectID;
const recipes = collections.recipes;
const ingredients = require('../data/ingredients');
//const ingredients = require('ingredients');

async function create(name, recipe_ingredients, steps, pic) {
    if (!(typeof(name) === 'string')) throw "name must be a string";
    if (!(recipe_ingredients instanceof Array)) throw "recipe_ingredients must be an Array";
    if (!(steps instanceof Array)) throw "steps must be an array";
    if (!(typeof(pic) === 'string')) throw "password must be a string";

    if (!name) throw "name may not be an empty string";
    if (recipe_ingredients.length < 1) throw "recipe_ingredients must be at least length 1";
    if (steps.length < 1) throw "steps must be at least length 1";

    const recipe_collection = await recipes();

    let ingredient_obj = null;
    for (const ingredient of recipe_ingredients) {
        if (!(ingredient.id instanceof ObjectId)) throw `ingredient id ${ingredient} is not an ObjectID`;
        try {
            ingredient_obj = await ingredients.get(ingredient.id)
        }
        catch(error) {
            throw `ingredient id ${ingredient} is not in our database`
        }
        if (!(typeof(ingredient.quantity) === 'string')) throw `ingredient quantity for ${ingredient.id} must be a string`
    }

    const recipe = {
        name: name,
        ingredients: recipe_ingredients,
        steps: steps,
        pic: pic,
    };

    const insert = await recipe_collection.insertOne(recipe);
    if (insert.insertedCount === 0) throw "could not add recipe";

    const id = insert.insertedId;
    return await get(id);
}

async function getAll() {
    const recipe_collection = await recipes();
    return await recipe_collection.find({}).toArray();
}

async function get(id) {
    if (!id) throw "id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const recipe_collection = await recipes();

    const result = await recipe_collection.findOne({ _id: id});
    if (!result) throw "no recipe found with that id";

    return result
}

// courtesy of Mozilla
// returns elements in setA that are *not* in setB
function difference(setA, setB) {
    var _difference = new Set(setA);
    for (var elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}

async function recipeRankFromInventory(inventory) {
    // determine the number or required ingredients for each recipe
    if (!(inventory instanceof Set)) throw "Inventory must be a set";
    const recipe_list = await getAll();

    const results = {};
    for (const recipe of recipe_list) {
        const recipe_ingredients = new Set(recipe.ingredients.map((elem) => {return elem.id.toString()}));
        const differ = difference(recipe_ingredients, inventory);
        const key = differ.size;
        if (key in results) {
            results[key].push(recipe);
        }
        else {
            results[key] = [recipe]
        }
    }

    return results;
}

async function getRecipesContainingIngredient(ingredient) {
    if (!ingredient) throw "ingredient must be defined";
    if (!(ingredient instanceof ObjectId)) throw "parameter ingredient must be an ObjectId type";

    const recipe_collection = await recipes();
    return await recipe_collection.find({"ingredients.id": ingredient}).toArray();
}

module.exports = {
    create: create,
    getAll: getAll,
    get: get,
    recipeRankFromInventory: recipeRankFromInventory,
    getRecipesContainingIngredient: getRecipesContainingIngredient
};
