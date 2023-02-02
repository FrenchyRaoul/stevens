const dbcon = require("./connection");

const getCollectionFn = collection => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbcon();
            _col = await db.collection(collection);
        }

        return _col;
    };
};

module.exports = {
    animals: getCollectionFn("animals")
};