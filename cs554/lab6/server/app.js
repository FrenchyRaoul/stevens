const express = require('express');
const app = express();
const port = 3000;
const routeConstructor = require('./routes');

require('dotenv').config()


routeConstructor(app);

app.listen(port, () => {
    console.log("Server is initialized");
    console.log(`Your routes will be running on http://localhost:${port}`);
})