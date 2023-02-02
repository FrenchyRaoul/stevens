const collections = require("./collections");
const bcrypt = require('bcrypt');
const salt = require('../config').salt;
//const posts = require('./reviews');
const ObjectId = require('mongodb').ObjectID;
const users = collections.users;

async function create(username, firstName, lastName, password) {
    if (!(typeof(username) === 'string')) throw "username must be a string";
    if (!(typeof(firstName) === 'string')) throw "firstName must be a string";
    if (!(typeof(lastName) === 'string')) throw "lastName must be a string";
    if (!(typeof(password) === 'string')) throw "password must be a string";

    if (!username || !firstName || !lastName || !password) throw "parameters may not be empty strings";

    if (await username_exists(username)) throw "this username is already taken";

    const user_collection = await users();

    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
        username: username.toLowerCase(),
        firstName: firstName,
        lastName: lastName,
        inventory: [],
        hashedPassword: hashedPassword
    };

    const insert = await user_collection.insertOne(user);
    if (insert.insertedCount === 0) throw "could not add user";

    const id = insert.insertedId;
    return await get(id);
}

async function getAll() {
    const user_collection = await users();
    return await user_collection.find({}).toArray();
}

async function get(id) {
    if (!id) throw "id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const user_collection = await users();

    const result = await user_collection.findOne({ _id: id});
    if (!result) throw "no user found with that id";

    return result
}

async function get_username(username) {
    if (!username) throw "username must be defined";
    if (!(typeof(username) === 'string')) throw "parameter username must be a string";

    const user_collection = await users();

    const result = await user_collection.findOne({ username: username.toLowerCase()});
    if (!result) throw "no user found with that username";

    return result
}

async function username_exists(username) {
    try {
        await get_username(username);
        return true;
    }
    catch(error) {
        return false;
    }
}

async function remove(id) {
    const user_collection = await users();
    if (!id) throw "parameter id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const data = await get(id);

    const deleted = await user_collection.deleteOne({ _id: id });

    if (deleted.deletedCount === 0) throw `unable to delete user with id ${id}`;

    return {
        deleted: true,
        data: data
    }
}

async function updateUser(id, newPass, newInv) {
    if (!id) throw "parameter id must be defined";
    if (!(id instanceof ObjectId)) throw "parameter id must be an ObjectId type";

    const update = {};
    if (newPass) {
        if (!(typeof(newPass) === 'string')) throw "parameter newPass must be a string type";
        update.hashedPassword = newPass;
    }
    if (newInv) {
        if (!(newInv instanceof Set)) throw "parameter newInv must be a Set type";
        update.inventory = Array.from(newInv);
    }
    if ((update.hashedPassword) || (update.inventory)) {
        const user_collection = await users();
        const results = await user_collection.updateOne({ _id: id}, { $set: update});
        if (results.modifiedCount === 0 && results.matchedCount === 0) {
            throw "could not update user info successfully";
        }
        return await get(id);
    }
    else {
        throw "either name or type must be provided"
    }
}

async function updateInventory(id, newInv) {
    return updateUser(id, null, newInv);
}

async function userFromUsername(username) {
    if (!username) throw "username must be defined";
    if (!(typeof(username) =='string')) throw "parameter username must be a string";

    const user_collection = await users();

    const result = await user_collection.findOne({ username: username});
    if (!result) throw "no user found with that username";

    return result
}

module.exports = {
    create: create,
    getAll: getAll,
    get: get,
    remove: remove,
    userFromUsername: userFromUsername,
    updateInventory: updateInventory,
    get_username: get_username,
    username_exists: username_exists
};
