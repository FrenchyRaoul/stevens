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
    users: getCollectionFn("users"),
    recipes: getCollectionFn("recipes"),
    ingredients: getCollectionFn("ingredients"),
    reviews: getCollectionFn("reviews"),
};
