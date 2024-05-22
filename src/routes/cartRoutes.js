const express = require('express');
const router = express.Router();
const CartManager = require('../dao/mongo/cartManager.js'); 
const cartManager = new CartManager();


router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.addCart();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear carrito' });
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await cartManager.getCartById(id);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener carrito' });
    }
});


router.post('/:id/products', async (req, res) => {
    const { id } = req.params;
    const { productId, quantity } = req.body;
    try {
        await cartManager.addProductToCart(id, productId, quantity);
        res.status(200).json({ message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

module.exports = router;
