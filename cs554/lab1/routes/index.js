const url = require('url');
const recipeRoutes = require('./recipes');
const mainRoutes = require('./main');


// Middleware #3: log all request bodies, but scrape out the password if it exists
async function requestLogger(req, res, next) {
    // make a copy in order to sanitize without breaking downstream handlers
    const bodyCopy = {
        ...req.body
    };
    if (bodyCopy) {
        if ("password" in bodyCopy) { bodyCopy.password = "****" }
        console.log(
            "Middleware #3: " +
            JSON.stringify({
                "url": req.originalUrl,
                "verb": req.method,
                "body": bodyCopy
            })
        );
    }
    next();
}

const constructorMethod = app => {
    app.use('*', requestLogger);  // Middleware #3: print out url, ver, and sanitized body
    app.use('/recipes', recipeRoutes);
    app.use('/', mainRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};


module.exports = constructorMethod;