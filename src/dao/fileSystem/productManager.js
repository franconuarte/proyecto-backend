const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor() {
        this.filePath = path.join(__dirname, 'products.json');
    }

    async loadProducts() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar productos desde el sistema de archivos:', error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            const products = await this.loadProducts();
            products.push(productData);
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
            console.log('Producto agregado correctamente:', productData);
        } catch (error) {
            console.error('Error al agregar producto al sistema de archivos:', error);
            throw error;
        }
    }

    async getProducts() {
        try {
            return await this.loadProducts();
        } catch (error) {
            console.error('Error al obtener productos desde el sistema de archivos:', error);
            throw error;
        }
    }

    async getProductById(productId) {
        try {
            const products = await this.loadProducts();
            const product = products.find(p => p.id === productId);
            if (product) {
                console.log('Producto obtenido correctamente:', product);
                return product;
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al obtener producto por ID desde el sistema de archivos:', error);
            throw error;
        }
    }

    async updateProduct(productId, updatedDetails) {
        try {
            const products = await this.loadProducts();
            const index = products.findIndex(p => p.id === productId);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedDetails };
                await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
                console.log('Producto actualizado correctamente:', products[index]);
                return products[index];
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al actualizar producto en el sistema de archivos:', error);
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            const products = await this.loadProducts();
            const filteredProducts = products.filter(p => p.id !== productId);
            await fs.promises.writeFile(this.filePath, JSON.stringify(filteredProducts, null, 2));
            console.log('Producto eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar producto del sistema de archivos:', error);
            throw error;
        }
    }
}

module.exports = ProductManager;
