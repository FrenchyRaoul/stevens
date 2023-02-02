const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');


const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);  // do this last, after the app has been set up

app.listen(3000, () => {
    console.log("Server is listening at http://localhost:3000");
});
