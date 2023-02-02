const collections = require("./collections");
const ObjectId = require('mongodb').ObjectID;
const reviews = collections.reviews;
const users = require('./users');
const recipes = require('./recipes');

async function create(userid, recipeid, body, rating) {
    if (!userid || !recipeid || !rating) throw "userid, recipeid, body, and rating cannot be empty";
    if (!(typeof(body) === 'string')) throw "body must be a string";
    if (!(userid instanceof ObjectId) || !(recipeid instanceof ObjectId)) throw "parameters userid and recipeid must be an ObjectId type";
    if (!(typeof(rating) === 'number')) throw "rating must be a number";


    const review_collection = await reviews();

    try {
        await users.get(userid);
    }
    catch(error) {
        throw `failed to find a user with id: ${userid}`
    }

    try {
        await recipes.get(recipeid);
    }
    catch(error) {
        throw `failed to find a recipe with id: ${recipeid}`
    }

    const review = {
        userid: userid,
        recipeid: recipeid,
        body: body,
        rating: rating
    };

    const insert = await review_collection.insertOne(review);
    if (insert.insertedCount === 0) throw "could not add review";

    review._id = insert.insertedId;
    return review;
}

async function get(id) {
    if (!id) throw "id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const review_collection = await reviews();

    const result = await review_collection.findOne({ _id: id});
    if (!result) throw "no review found with that id";

    return result
}

async function getAll() {
    const review_collection = await reviews();
    return await review_collection.find({}).toArray();
}

async function getReviewsForRecipe(recipeid) {
    if (!(recipeid instanceof ObjectId)) throw "recipeid must be an ObjectId type";

    const review_collection = await reviews();

    return await review_collection.find({recipeid: recipeid}).toArray();
}

async function remove(id) {
    const review_collection = await reviews();
    if (!id) throw "parameter id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const data = await get(id);

    const deleted = await review_collection.deleteOne({ _id: id });

    if (deleted.deletedCount === 0) throw `unable to delete review with id ${id}`;

    return {
        deleted: true,
        data: data
    }
}

module.exports = {
    create: create,
    getAll: getAll,
    getReviewsForRecipe: getReviewsForRecipe,
    remove: remove
};
