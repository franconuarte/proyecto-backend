const Product = require('../models/product');

class ProductManager {


    async addProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();
            console.log('Producto agregado correctamente:', product);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const products = await Product.find();
            console.log('Productos obtenidos correctamente:', products);
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async getProductById(productId) {
        try {
            const product = await Product.findById(productId);
            if (product) {
                console.log('Producto obtenido correctamente:', product);
                return product;
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            throw error;
        }
    }

    async updateProduct(productId, updatedDetails) {
        try {
            const product = await Product.findByIdAndUpdate(productId, updatedDetails, { new: true });
            console.log('Producto actualizado correctamente:', product);
            return product;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            const product = await Product.findByIdAndDelete(productId);
            if (product) {
                console.log('Producto eliminado correctamente:', product);
            } else {
                console.error('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }
}

module.exports = ProductManager;
