const mainRoutes = require('./main');
const constructorMethod = (app) => {
    app.use('/', mainRoutes);
    app.use('*', (req, res) => {
        res.status(404).json({error: "not found"})
    })
}

module.exports = constructorMethod;