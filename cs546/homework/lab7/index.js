const express = require("express");
const app = express();
const configRoutes = require("./routes");

app.use(express.json());
configRoutes(app);

app.listen(3000, () => {
  console.log("Server running on localhost:3000");
});
