const dbcon = require('../config/mongoConnection');

const getCollection = name => {
    let collection = undefined;

    return async () => {
        if (!collection) {
            const db = await dbcon();
            collection = await db.collection(name);
        }
        return collection;
    };
};

module.exports = {
    recipeCollection: getCollection('recipes'),
    userCollection: getCollection('users'),
}