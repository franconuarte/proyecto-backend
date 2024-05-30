const express = require('express');
const router = express.Router();
const CartManager = require('../dao/mongo/cartManager.js');
const cartManager = new CartManager();


router.post('/', async (req, res) => {
    try {
        // Aquí deberías obtener el ID del usuario autenticado desde el objeto `req`
        const userId = req.user.id; // Por ejemplo, si estás utilizando JWT, puedes acceder al ID del usuario desde el token

        // Crea el carrito y asigna el ID del usuario
        const cart = await cartManager.addCart(userId);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear carrito' });
    }
});



router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await cartManager.getCart(id); // Cambiamos getCartById a getCart
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
        await cartManager.addToCart(id, productId, quantity);
        res.status(200).json({ message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});


router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.deleteProductFromCart(cid, pid);
        res.status(200).json({ message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});


router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const cart = await cartManager.updateCart(cid, products);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar carrito' });
    }
});


router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        await cartManager.updateProductQuantity(cid, pid, quantity);
        res.status(200).json({ message: 'Cantidad de producto actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto' });
    }
});


router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        await cartManager.clearCart(cid);
        res.status(200).json({ message: 'Todos los productos eliminados del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
    }
});

module.exports = router;
