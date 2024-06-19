const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('./passport');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017')
    .then(() => console.log('Conexión a MongoDB establecida'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));


app.set('views', path.join(__dirname, 'views'));
app.engine('.handlebars', exphbs({
    defaultLayout: 'index',
    extname: '.handlebars'
}));
app.set('view engine', '.handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'tu_clave_secreta',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use('/', authRoutes);


app.get('/index', authMiddleware, (req, res) => {

    res.render('index', { user: req.user });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

