const express = require('express');
const app = express();

const configRoutes = require('./routes');

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

app.use('/public', express.static('public'));
app.use('/scripts', express.static('scripts'));

configRoutes(app);  // do this last, after the app has been set up

app.listen(3000, () => {
    console.log("Server is listening at http://localhost:3000");
});
