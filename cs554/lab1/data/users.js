const usersCollection = require("./collections");
const bcrypt = require('bcrypt');
const {userCollection} = require("./collections");
const salt = require('../config/config').salt;

function validatePassword(password) {
    if (password === undefined) throw "a password must be provided";
    if (typeof password !== 'string') throw "password must be a string";
    if (password.length < 6) throw "password must be at least 6 characters";
    if (password.toLowerCase() === password) throw "password must contain at least one upper case character";
    if (password.toUpperCase() === password) throw "password must contain at least one lower case character";
    if (!/.*\d.*/.test(password)) throw "password must contain at least one number";
    if (/^[0-9A-Za-z]+$/.test(password)) throw "password must contain at least one special character";
}

function validateUsername(username) {
    if (username === undefined) throw "username must be provided";
    if (typeof username !== 'string') throw "username must be a string";
    if (username.length < 3) throw "username must be at least 3 characters"
    if (!/^[0-9A-Za-z]+$/.test(username)) throw "username must be alphanumeric, no special characters"
}

// I am intentionally allowing users with no surname; not everyone in the world has two names
function validateName(name) {
    if (name === undefined) throw "name must be provided";
    if (typeof name !== 'string') throw "name must be a string";
    if (name.length <= 3) throw "name must be at least 4 characters";
    if (/\d/.test(name)) throw "name cannot contain numbers";
}

async function getUserByID(id) {
    if (id === undefined) throw "id must be defined";
    const coll = await userCollection();
    const result = await coll.findOne({ _id: id });
    if (!result) throw `no user found with id ${id}`;
    return result;
}

async function getUserByUsername(username) {
    if (username === undefined) throw "username must be defined";
    const coll = await userCollection();
    const result = await coll.findOne({ username: username });
    if (!result) throw `no user found with username ${username}`;
    return result;
}


async function createUser(name, username, password) {
    validateName(name);
    validateUsername(username);
    validatePassword(password);

    username = username.toLowerCase()  // treat all usernames as case-insensitive (by forcing them to lowercase)
    try {
        await getUserByUsername(username);
    } catch {
        const hashed = await bcrypt.hash(password, salt);
        const coll = await userCollection();
        const result = await coll.insertOne({"username": username, "password": hashed, "name": name});
        return await getUserByID(result.insertedId);
    }
    throw `user ${username} already exists!`
}

async function login(username, password) {
    username = username.toLowerCase()  // treat all usernames as case-insensitive (by forcing them to lowercase)
    const error_text = "invalid username/password combination";
    let userObject = undefined;
    try {
        validateUsername(username);
        validatePassword(password);
        userObject = await getUserByUsername(username);
    } catch (e) {
        throw error_text
    }
    const hashed = await bcrypt.hash(password, salt);
    if (!(userObject.password === hashed)) {
        throw error_text;
    }
    return userObject;
}

module.exports = {
    createUser,
    login,
    getUserByUsername,
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////// TESTS /////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function test_validate_password() {
    const assert = require('assert');

    assert.throws(() => validatePassword())
    assert.throws(() => validatePassword(3434234))
    assert.throws(() => validatePassword("12345"))
    assert.throws(() => validatePassword("asdfgh_1"))
    assert.throws(() => validatePassword("FKDJSH_2"))
    assert.throws(() => validatePassword("asdFGH_"))
    assert.throws(() => validatePassword("SDFsdf12"))
    validatePassword("aijdf234DF.")
}

function test_validate_username() {
    const assert = require('assert');

    assert.throws(() => validateUsername())
    assert.throws(() => validateUsername(3434234))
    assert.throws(() => validateUsername("ab"))
    assert.throws(() => validateUsername("asdf_"))
    validateUsername("nlespera")
}