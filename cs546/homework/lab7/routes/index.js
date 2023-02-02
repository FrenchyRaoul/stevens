const animals = require("./animals");
const posts = require("./posts");
const likes = require("./likes");

const constructorMethod = app => {
  app.use("/animals", animals);
  app.use("/posts", posts);
  app.use("/likes", likes);

  app.use("*", (req, res) => {
      res.status(404).json({ error: "Not found" }); 
  }); 
};

module.exports = constructorMethod;
