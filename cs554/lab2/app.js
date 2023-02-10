const express = require('express');
const session = require('express-session');
const app = express();
const configRoutes = require('./routes');

app.use(express.json());
app.use(session({
    name: "AuthCookie",
    secret: "lab1 secret auth string",
    resave: false,
    saveUninitialized: true,
    cooke: {maxAge: 300000}
}))
configRoutes(app);

app.listen(3000, () => {
    console.log("Server is initialized");
    console.log("Your routes will be running on http://localhost:3000");
})