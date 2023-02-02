const home = require("./home");
const search = require("./search");
const details = require("./details");

const constructorMethod = app  => {
    app.use("/", home);
    app.use("/search", search);
    app.use("/details", details);

    app.use("*", (req,res) => {
        res.sendStatus(404)
    })
};

module.exports = constructorMethod;