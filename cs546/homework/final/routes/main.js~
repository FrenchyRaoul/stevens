const express = require('express');
const bcrypt = require('bcrypt');
const users = require('../users');
const router = express.Router();
//const salt = bcrypt.genSaltSync(16);
const salt = "$2b$16$7otM4tc4xSGnpH4kyYRure"; //regenerating the salt every time changes the hashes...

router.get('/', async (req, res, next) => {
    // if not authenticated
    if (!req.session.authenticated) {
        res.render('login_page.handlebars', {
            title: 'Log In',
            error: req.session.error
        });
        req.session.error = null;
    }
    else {
        res.redirect('/private');
    }
    //res.redirect('/private');
    // else
    // res.render(loginPage)
    //next()
});


router.get('/private', async (req, res, next) => {
    if (!req.session.authenticated) {
        req.status = 403;
        req.session.error = "You must be logged in to access that page";
        res.redirect('/');
    }
    else {
        let user = null;
        for (const userobj of users) {
            if (userobj.username === req.session.username) {
                user = userobj;
                break;
            }
        }
        res.render('private.handlebars', {
            title: `${user.username} Info`,
            user: user,
        });
    }
    // get user information from cookie
    //display user information (except password)
});


router.post('/login', async (req, res, next) => {
   // get username and password from form
    let user = null;
    for (const userobj of users) {
        if (userobj.username === req.body.username) {
            user = userobj;
            break;
        }
    }
    if (!user) {
        // attacker could user the fast response time of this redirect to discover user names. ignoring for this lab.
        req.session.error = "Username or password is incorrect";
        res.redirect('/');
    }
    else {
        // find record containing username
        const real_hash = user.hashedPassword;

        // hash the attempted password
        const attempt_hash = bcrypt.hashSync(req.body.password, salt);

        // check if password matches password from record
        if (attempt_hash === real_hash) {
            const now = new Date();
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 0.5); // 30 min expiry

            req.session.username = user.username;
            req.session.authenticated = true;
            res.redirect('/private');
        }
        else  {
            res.status = 401;
            req.session.error = "Username or password is incorrect";
            res.redirect('/');
        }

    }

});

router.get('/logout', async (req, res, next) => {
    req.session.destroy();
    res.render('logout.handlebars', {title: "Logging Out..."});
});

module.exports = router;