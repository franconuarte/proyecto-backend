const express = require('express');
const router = express.Router();
const passport = require('../passport');
const authMiddleware = require('../middleware/authMiddleware');
const {
    getCurrentSession,
    renderLogin,
    renderRegister,
    register,
    logout,
    githubAuth,
    githubAuthCallback
} = require('../controllers/authController');


router.get('/api/sessions/current', authMiddleware, getCurrentSession);

router.get('/login', renderLogin);

router.post('/login', passport.authenticate('login', {
    successRedirect: '/index',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', renderRegister);

router.post('/register', register);

router.get('/logout', logout);

router.get('/auth/github', githubAuth);

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    githubAuthCallback
);

module.exports = router;
