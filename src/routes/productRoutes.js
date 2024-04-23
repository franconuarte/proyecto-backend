const express = require('express');
const router = express.Router();
const path = require('path');
const ProductManager = require('../productManager');

const productManager = new ProductManager(path.join(__dirname, '../productos.json'));




router.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.json(products);
});

router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = productManager.getProductById(productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.post('/', (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.status(201).json(newProduct);
});

router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedDetails = req.body;
    productManager.updateProduct(productId, updatedDetails);
    res.json({ message: `Producto con ID ${productId} actualizado` });
});

router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    productManager.deleteProduct(productId);
    res.json({ message: `Producto con ID ${productId} eliminado` });
});

module.exports = router;

