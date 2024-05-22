const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/mongo/productManager.js'); 
const productManager = new ProductManager();


router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productManager.getProductById(id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});


router.post('/', async (req, res) => {
    const productData = req.body;
    try {
        const product = await productManager.addProduct(productData);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear producto' });
    }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedDetails = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(id, updatedDetails);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await productManager.deleteProduct(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

module.exports = router;
