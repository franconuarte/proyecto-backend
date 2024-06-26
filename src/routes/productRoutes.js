const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/mongo/productManager');
const productManager = new ProductManager();


router.get('/', async (req, res) => {
    try {
        const { limit = 5, page = 1, sort, query } = req.query;
        const products = await productManager.getProducts({ limit, page, sort, query });
        res.json(products);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productManager.getProductById(id);
        if (product) {
            res.json({ status: 'success', payload: product });
        } else {
            res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener producto' });
    }
});


router.post('/', async (req, res) => {
    const productData = req.body;
    try {
        const product = await productManager.addProduct(productData);
        res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al crear producto' });
    }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedDetails = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(id, updatedDetails);
        res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al actualizar producto' });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await productManager.deleteProduct(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al eliminar producto' });
    }
});

module.exports = router;
