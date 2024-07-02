const passport = require('../passport');
const User = require('../dao/models/user');

const getCurrentSession = (req, res) => {
    res.json({ user: req.user });
};

const renderLogin = (req, res) => {
    res.render('login');
};

const renderRegister = (req, res) => {
    res.render('register');
};

const register = (req, res, next) => {
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
};

const logout = (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
};

const githubAuth = passport.authenticate('github');

const githubAuthCallback = (req, res) => {
    res.redirect('/index');
};

module.exports = {
    getCurrentSession,
    renderLogin,
    renderRegister,
    register,
    logout,
    githubAuth,
    githubAuthCallback
};
