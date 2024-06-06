const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const socketio = require('socket.io');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const User = require('./dao/models/user.js');
const productsRouter = require('./routes/productRoutes.js');
const cartsRouter = require('./routes/cartRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const Message = require('./dao/models/message.js');
const ProductManager = require('./dao/mongo/productManager.js');
const authMiddleware = require('./middleware/authMiddleware.js');
const flash = require('connect-flash');

const app = express();
const http = require('http').Server(app);
const io = socketio(http);

const productManager = new ProductManager();

app.use((req, res, next) => {
    req.io = io;
    next();
});

mongoose.connect('mongodb://127.0.0.1:27017')
    .then(() => {
        console.log('Conexión a MongoDB establecida');
    })
    .catch(err => {
        console.error('Error de conexión a MongoDB:', err);
    });

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('changePage', async (page) => {
        try {
            const { limit = 5, sort, query } = socket.handshake.query;
            const products = await productManager.getProducts({ limit, page, sort, query });
            socket.emit('pageChanged', products);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    });

    socket.on('sendMessage', async (data) => {
        const { user, message } = data;
        const newMessage = new Message({ user, message });
        await newMessage.save();
        io.emit('message', data);
    });
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(flash());

passport.use('register', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
    async (req, email, password, done) => {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                const errorMessage = 'El email ya está registrado';
                req.flash('error', errorMessage);
                return done(null, false, { message: errorMessage });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ email, password: hashedPassword });
            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            console.error('Error en el registro:', error);
            req.flash('error', 'Error al registrar el usuario');
            return done(error); // Retornar el error
        }
    }
));



passport.use('login', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (req, email, password, done) => { // Agrega 'req' como primer argumento
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, req.flash('error', 'Usuario no encontrado'));
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, req.flash('error', 'Contraseña incorrecta'));
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));


passport.use(new GitHubStrategy({
    clientID: "Ov23li5X0606PEzj5lRv",
    clientSecret: "a872f63eb58591ac26683a641e54cce46edd8606",
    callbackURL: 'http://localhost:8080/auth/github/callback'
}, async (req, accessToken, refreshToken, profile, done) => { // <-- Asegúrate de tener 'done' como un parámetro aquí
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

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', authRouter);

app.set('views', path.join(__dirname, 'views'));

app.engine('.handlebars', exphbs({
    defaultLayout: 'index',
    extname: '.handlebars',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    }
}));
app.set('view engine', '.handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/register');
});

app.get('/realTimeProducts', authMiddleware, (req, res) => {
    res.render('realTimeProducts', { title: 'Productos en Tiempo Real' });
});

app.get('/chat', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find();
        res.render('chat', { messages });
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/index', authMiddleware, (req, res) => {
    res.render('index', { user: req.session.user });
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/index');
    }
);

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
