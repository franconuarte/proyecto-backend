const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('./dao/models/user');


passport.use(new GitHubStrategy({
    clientID: 'Ov23li5X0606PEzj5lRv',
    clientSecret: '1e06c72a876f9576c307fc987996a21cdb4a07f0',
    callbackURL: 'http://localhost:8080/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let email = null;
        if (profile.emails && profile.emails.length > 0) {
            email = profile.emails[0].value;
        }
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
            user = new User({ githubId: profile.id, email });
            await user.save();
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));


passport.use('login', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));


passport.use('register', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (user) {
                return done(null, false, { message: 'El email ya está registrado' });
            }

            const newUser = new User({
                email,
                password,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
            });

            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
