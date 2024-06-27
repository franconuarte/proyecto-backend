const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('./passport');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const sessionRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/test', {

}).then(() => console.log('Conexión a MongoDB establecida'))
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
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use('/', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sessions', sessionRoutes);


app.get('/index', authMiddleware, (req, res) => {
    res.render('index', { user: req.user });
});


const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

module.exports = server;
