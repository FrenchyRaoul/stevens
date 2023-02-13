const recipeRoutes = require('./recipes');
const mainRoutes = require('./main');
const {refreshSession} = require('../data/redis');


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

const urlCounter = {};

// Middleware #4: log all request urls and count
async function urlLogger(req, res, next) {
    if (urlCounter.hasOwnProperty(req.originalUrl)) urlCounter[req.originalUrl] += 1;
    else urlCounter[req.originalUrl] = 1;
    console.log(`Middleware #4: ${JSON.stringify(urlCounter)}`);
    next();
}

// Custom Middleware: refresh the session whenever a request is made to the server
async function refreshSessionIfLoggedIn(req, res, next) {
    try {
        await refreshSession(req);
    } catch (e) {
        // console.log(`session did not refresh: ${e}`);
    }
    next();
}

const constructorMethod = app => {
    app.use('*', requestLogger);  // Middleware #3: print out url, ver, and sanitized body
    app.use('*', urlLogger);  // Middleware #3: print out url, ver, and sanitized body
    app.use('*', refreshSessionIfLoggedIn)
    app.use('/recipes', recipeRoutes);
    app.use('/', mainRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};


module.exports = constructorMethod;