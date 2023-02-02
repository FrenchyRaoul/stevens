const collections = require("./collections");
const ObjectId = require('mongodb').ObjectID;
const ingredients = collections.ingredients;
// const users = require('./users');
// const recipes = require('./recipes');

async function create(name, type, categories, abv) {
    if (!name || !type || !categories) throw "name, type, and category cannot be empty";
    if (!(typeof(name) === 'string')) throw "name must be a string";
    if (!(typeof(type) === 'string')) throw "type must be a string";
    if (!(categories instanceof Array)) throw "categories must be an array";

    const ingredient_collection = await ingredients();

    // TODO: uniqueify ingredients. fix case and check if it already exists.

    const ingredient = {
        name: name,
        type: type,
        categories: categories,
        abv: abv
    };

    const insert = await ingredient_collection.insertOne(ingredient);
    if (insert.insertedCount === 0) throw "could not add review";

    ingredient._id = insert.insertedId;
    return ingredient;
}

async function getAll() {
    const ingredient_collection = await ingredients();
    return await ingredient_collection.find({}).toArray();
}

async function get(id) {
    if (!id) throw "id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const ingredient_collection = await ingredients();

    const result = await ingredient_collection.findOne({ _id: id});
    if (!result) throw "no ingredient found with that id";

    return result
}

async function remove(id) {
    const ingredient_collection = await ingredients();
    if (!id) throw "parameter id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const data = await get(id);
    const deleted = await ingredient_collection.deleteOne({ _id: id });

    if (deleted.deletedCount === 0) throw `unable to delete ingredient with id ${id}`;

    return {
        deleted: true,
        data: data
    }
}

module.exports = {
    get: get,
    create: create,
    getAll: getAll,
    remove: remove,
};
