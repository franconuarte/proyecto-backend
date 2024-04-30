const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');
const ProductManager = require('./productManager');
const CartManager = require('./cartManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.engine('.handlebars', (filePath, options, callback) => {
    fs.readFile(filePath, (err, content) => {
        if (err) return callback(err);
        const template = handlebars.compile(content.toString());
        return callback(null, template(options));
    });
});
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());


const productManager = new ProductManager(path.join(__dirname, 'productos.json'));
const cartManager = new CartManager(path.join(__dirname, 'carritos.json'));

const productRoutes = require('./routes/productRoutes')(productManager);
const cartRoutes = require('./routes/cartRoutes')(cartManager, productManager);

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);


(async () => {
    try {
        await productManager.loadProducts();
        console.log('Productos cargados correctamente.');
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
})();


app.get('/', async (req, res) => {
    try {
        const productos = productManager.getProducts();
        res.render('index', { productos });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});


app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {});
});


io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('createProduct', (data) => {
        io.emit('productCreated', {});
    });

    socket.on('deleteProduct', (productId) => {
        io.emit('productDeleted', productId);
    });
});


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
