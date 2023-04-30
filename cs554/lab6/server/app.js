const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;
const routeConstructor = require('./routes');

require('dotenv').config()

app.use(cors());

routeConstructor(app);

app.listen(port, () => {
    console.log("Server is initialized");
    console.log(`Your routes will be running on http://localhost:${port}`);
})