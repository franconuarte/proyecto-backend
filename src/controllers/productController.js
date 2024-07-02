const ProductManager = require('../dao/mongo/productManager');
const productManager = new ProductManager();

async function getProducts(req, res) {
    try {
        const { limit = 5, page = 1, sort, query } = req.query;
        const products = await productManager.getProducts({ limit, page, sort, query });
        res.json(products);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch products' });
    }
}

async function getProductById(req, res) {
    const { id } = req.params;
    try {
        const product = await productManager.getProductById(id);
        if (product) {
            res.json({ status: 'success', payload: product });
        } else {
            res.status(404).json({ status: 'error', message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch product' });
    }
}

async function addProduct(req, res) {
    const productData = req.body;
    try {
        const product = await productManager.addProduct(productData);
        res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to create product' });
    }
}

async function updateProduct(req, res) {
    const { id } = req.params;
    const updatedDetails = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(id, updatedDetails);
        res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to update product' });
    }
}

async function deleteProduct(req, res) {
    const { id } = req.params;
    try {
        await productManager.deleteProduct(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to delete product' });
    }
}

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
};
