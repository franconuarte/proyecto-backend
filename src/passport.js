// passport.js

const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./dao/models/user'); // Ajusta la ruta según tu estructura de archivos

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

