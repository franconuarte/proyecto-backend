const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../dao/models/user.js');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/index',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            console.error('Error en la autenticación:', err);
            return next(err);
        }
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/register');
        }
        req.login(user, (err) => {
            if (err) {
                console.error('Error al iniciar sesión:', err);
                return next(err);
            }
            return res.redirect('/index');
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
