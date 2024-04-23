const fs = require('fs').promises;
const { log } = require('console');
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];
        this.nextId = 1;
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            this.products = JSON.parse(data);

            this.nextId = this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;
            console.log('Productos cargados exitosamente.');
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('Archivo de productos no encontrado. Creando nuevo archivo.');
                await this.saveProducts();
            } else {
                console.error('Error al cargar los productos:', error);
            }
        }

    }

    async saveProducts() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2));
            console.log('Productos guardados exitosamente.');
        } catch (error) {
            console.error('Error al guardar los productos:', error);
        }
    }

    addProduct(product) {
        if (!this.isProductValid(product)) {
            console.log("Producto no válido");
            return;
        }

        if (this.isCodeDuplicate(product.code)) {
            console.log("El código del producto está duplicado");
            return;
        }

        product.id = this.nextId++;
        this.products.push(product);
        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            return product;
        } else {
            console.log("No se encontró el producto");
        }
    }

    isProductValid(product) {
        return (
            product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock !== undefined
        );
    }

    isCodeDuplicate(code) {
        return this.products.some(p => p.code === code);
    }

    updateProduct(id, newDetails) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...newDetails };
            console.log(`Producto con ID ${id} actualizado con éxito`);
            this.saveProducts();
        } else {
            console.log(`No se encontró ningún producto con el ID ${id}`);
        }
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            const deletedProduct = this.products.splice(productIndex, 1)[0];
            console.log("Producto eliminado:", deletedProduct);
            this.saveProducts();
        } else {
            console.log(`No se encontró ningún producto con el ID ${id}`);
        }
    }
}

module.exports = ProductManager;
