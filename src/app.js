const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const socketio = require('socket.io');
const session = require('express-session');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/productRoutes.js');
const cartsRouter = require('./routes/cartRoutes.js');
const authRouter = require('./routes/authRoutes.js'); // Importa las rutas de autenticación
const Message = require('./dao/models/message.js');
const ProductManager = require('./dao/mongo/productManager.js');
const authMiddleware = require('./middleware/authMiddleware.js'); // Importa el middleware de autenticación

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

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', authRouter); // Usa las rutas de autenticación

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
    res.redirect('/register'); // Redirige automáticamente a la página de registro
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

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
