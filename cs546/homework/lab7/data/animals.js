const collections = require("./collections");
const posts = require('./posts');
const ObjectId = require('mongodb').ObjectID;
const animals = collections.animals;

async function create(name, animalType) {
    if (!(typeof(name) === 'string')) throw "name must be a string";
    if (!(typeof(animalType) === 'string')) throw "type must be a string";

    if (!name || !animalType) throw "name and type cannot be empty strings";

    const animal_collection = await animals();

    const animal = {
        name: name,
        animalType: animalType,
        likes: []
    };

    const insert = await animal_collection.insertOne(animal);
    if (insert.insertedCount === 0) throw "could not add animal";

    const id = insert.insertedId;
    return await get(id);
}

async function getAll() {
    const animal_collection = await animals();
    return await animal_collection.find({}).toArray();
}

async function get(id) {
    if (!id) throw "id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const animal_collection = await animals();

    const result = await animal_collection.findOne({ _id: id});
    if (!result) throw "no animal found with that id";

    return result
}

async function remove(id) {
    const animal_collection = await animals();
    if (!id) throw "parameter id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const data = await get(id);

    const deleted = await animal_collection.deleteOne({ _id: id });

    if (deleted.deletedCount === 0) throw `unable to delete animal with id ${id}`;

    return {
        deleted: true,
        data: {
            _id: id,
            name: data.name,
            animalType: data.animalType,
            likes: data.likes
        }
    }
}

async function updateAnimal(id, newName, newType) {
    if (!id) throw "parameter id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const update = {};
    if (newName) {
        if (!(typeof(newName) === 'string')) throw "parameter newName must be a string type";
        update.name = newName;
    }
    if (newType) {
        if (!(typeof(newType) === 'string')) throw "parameter newType must be a string type";
        update.animalType = newType;
    }
    if ((update.name) || (update.animalType)) {
        const animal_collection = await animals();
        const results = await animal_collection.updateOne({ _id: id}, { $set: update});
        if (results.modifiedCount === 0) {
            throw "could not update name successfully";
        }
        return await get(id);
    }
    else {
        throw "either name or type must be provided"
    }
}

async function addLike(animalId, postId) {
    if (!animalId) throw "parameter animalId must be defined";
    if (!(animalId instanceof ObjectId)) throw "parameter animalId must be an ObjectId type";

    if (!postId) throw "parameter postId must be defined";
    if (!(postId instanceof ObjectId)) throw "parameter postId must be an ObjectId type";

    let animal = null;

    try {
        animal = await get(animalId);
        await posts.get(postId);
    }
    catch(error) {
        throw "either post or animal does not exist in the database."
    }

    const likes = animal.likes;
    if (likes.map((val) => val.toString()).includes(postId.toString())) {
        return
    }
    else {
        likes.push(postId);
    }
    const animal_collection = await animals();
    const results = await animal_collection.updateOne({ _id: animalId}, { $set: {likes: likes}});

    if (results.modifiedCount === 0) {
        throw "could not update name successfully";
    }

}

async function deleteLike(animalId, postId) {
    if (!animalId) throw "parameter animalId must be defined";
    if (!(animalId instanceof ObjectId)) throw "parameter animalId must be an ObjectId type";

    if (!postId) throw "parameter postId must be defined";
    if (!(postId instanceof ObjectId)) throw "parameter postId must be an ObjectId type";

    let animal = null;

    try {
        animal = await get(animalId);
        await posts.get(postId);
    }
    catch(error) {
        throw "either post or animal does not exist in the database."
    }

    if (!(animal.likes.map((val) => val.toString()).includes(postId.toString()))) {
        return
    }

    const likes = animal.likes.filter(id => (!(id.toString() === postId.toString())));

    const animal_collection = await animals();
    const results = await animal_collection.updateOne({ _id: animalId}, { $set: {likes: likes}});

    if (results.modifiedCount === 0) {
        throw "could not update name successfully";
    }

}

module.exports = {
    create: create,
    getAll: getAll,
    get: get,
    remove: remove,
    updateAnimal: updateAnimal,
    addLike: addLike,
    deleteLike: deleteLike
};
