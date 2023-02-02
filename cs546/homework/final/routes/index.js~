const main = require("./main");

const constructorMethod = app => {
    app.use("/", main);
      
    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
