const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 3000;
const filePath = path.join(__dirname, 'productos.json');

app.use(express.json());

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

const productManager = new ProductManager(filePath);


productManager.loadProducts().catch(error => {
    console.error('Error al cargar los productos:', error);
});


app.get('/productos', (req, res) => {
    const products = productManager.getProducts();
    res.json(products);
});

app.get('/productos/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = productManager.getProductById(productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.post('/productos', (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.status(201).json(newProduct);
});

app.put('/productos/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedDetails = req.body;
    productManager.updateProduct(productId, updatedDetails);
    res.json({ message: `Producto con ID ${productId} actualizado` });
});

app.delete('/productos/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    productManager.deleteProduct(productId);
    res.json({ message: `Producto con ID ${productId} eliminado` });
});


app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});