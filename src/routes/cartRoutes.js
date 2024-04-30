const express = require('express');
const router = express.Router();

module.exports = (cartManager, productManager) => {
    router.post('/', (req, res) => {
        const newCart = { products: [] };
        cartManager.addCart(newCart);
        res.status(201).json(newCart);
    });

    router.get('/:id', (req, res) => {
        const cartId = parseInt(req.params.id);
        const cart = cartManager.getCartById(cartId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    });

    router.post('/:cid/product/:pid', (req, res) => {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = req.body.quantity || 1;

        const product = productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        cartManager.addProductToCart(cartId, productId, quantity);
        res.json({ message: `Producto con ID ${productId} agregado al carrito con ID ${cartId}` });
    });

    return router;
};

