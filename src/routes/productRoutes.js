const express = require('express');
const router = express.Router();
const path = require('path');
const ProductManager = require('../productManager');

module.exports = (productManager) => {

    router.get('/', (req, res) => {
        const products = productManager.getProducts();
        console.log('Productos obtenidos correctamente:', products);
        res.json(products);
    });


    router.get('/:id', (req, res) => {
        const productId = parseInt(req.params.id);
        const product = productManager.getProductById(productId);
        if (product) {
            console.log('Producto obtenido correctamente:', product);
            res.json(product);
        } else {
            console.error('Producto no encontrado');
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    });


    router.post('/', (req, res) => {
        const newProduct = req.body;
        try {
            productManager.addProduct(newProduct);
            console.log('Producto agregado correctamente:', newProduct);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });


    router.put('/:id', (req, res) => {
        const productId = parseInt(req.params.id);
        const updatedDetails = req.body;
        try {
            productManager.updateProduct(productId, updatedDetails);
            console.log('Producto actualizado correctamente:', updatedDetails);
            res.json({ message: `Producto con ID ${productId} actualizado` });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });


    router.delete('/:id', (req, res) => {
        const productId = parseInt(req.params.id);
        try {
            productManager.deleteProduct(productId);
            console.log('Producto eliminado correctamente:', productId);
            res.json({ message: `Producto con ID ${productId} eliminado` });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    return router;
};
