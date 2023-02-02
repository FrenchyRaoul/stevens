const express = require('express');
const app = express();
const session = require('express-session');
// const cookieParser = require('cookie-parser');
const static_ = express.static(__dirname + '/public');
const exphbs = require('express-handlebars');
const configRoutes = require('./routes');

app.use('/public', static_);


// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// the code provided in the assignment creates a cookie immediate when a user accesses the site. However, we can use the
// session object that was created in order to store authentication information.
app.use(session({
  name: 'AuthCookie',
  secret: 'Seagulls! ft. Yoda',
  resave: false,
  saveUninitialized: true
}));

app.use(function (req, res, next) {
    const date = new Date().toUTCString();
    const method = req.method;
    const route = req.originalUrl;

    const isAuth = req.session.authenticated;
    let authstring = null;
    if (isAuth) {
        authstring = "Authenticated";
    }
    else {
        authstring = "Non-Authenticated";
    }
    console.log(`[${date}]: ${method} ${route} (${authstring} User)`);
    next();
});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, function() {
  console.log('Server is running on localhost:3000');
});
