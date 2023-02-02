const main = require("./main");
const users = require("./users");
const recipes = require("./recipes");
const reviews = require("./review");
const ingredients = require("./ingredients");

const constructorMethod = app => {
    app.use("/", main);
    app.use("/u", users);
    app.use("/r", recipes);
    app.use("/i", ingredients);
    app.use("/review", reviews);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
