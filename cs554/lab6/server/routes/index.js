const marvelRoutes = require('./main');

const routeConstructor = (app) => {
    app.use('/', marvelRoutes);
    app.use('*', (req, res) => {
        res.status(404).json({error: "not found"})
    })
}

module.exports = routeConstructor;