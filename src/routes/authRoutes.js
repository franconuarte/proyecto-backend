// authRoutes.js

const express = require('express');
const router = express.Router();
const passport = require('../passport.js'); // Asegúrate de que esté apuntando correctamente a tu archivo passport.js
const User = require('../dao/models/user.js');

// Ruta de login
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/index',
    failureRedirect: '/login',
    failureFlash: true
}));

// Ruta de registro
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
            console.log("Usuario registrado y sesión iniciada:", user);
            return res.redirect('/index');
        });
    })(req, res, next);
});

// Ruta de logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

// Ruta de autenticación de GitHub
router.get('/auth/github',
    passport.authenticate('github'));

// Ruta de callback después de autenticación con GitHub
router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Redirigir al usuario a '/index' después de la autenticación exitosa
        res.redirect('/index');
    });

module.exports = router;
