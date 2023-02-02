const express = require('express');
const app = express();
const session = require('express-session');
const static_ = express.static(__dirname + '/public');
const exphbs = require('express-handlebars');
const configRoutes = require('./routes');
const config = require('./config');

app.use('/public', static_);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

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

const exphbs_config = exphbs({
    defaultLayout: 'main',
    helpers: {
        getStars: (num) => {
            const good = new Array(num).fill("&#9733;");
            const goodstring = `<span class="good-stars">${good.join('')}</span>`;
            const bad = new Array(5 - num).fill("&#9734;");
            const badstring = `<span class="bad-stars">${bad.join('')}</span>`;
            return `${goodstring}${badstring}`;
        }
    }
});

app.engine('handlebars', exphbs_config);
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(config.port, function() {
  console.log('Server is running on localhost:3000');
});
