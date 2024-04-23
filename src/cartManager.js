const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.carts = [];
        this.nextId = 1;
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            this.carts = JSON.parse(data);

            this.nextId = this.carts.length > 0 ? Math.max(...this.carts.map(cart => cart.id)) + 1 : 1;
            console.log('Carritos cargados exitosamente.');
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('Archivo de carritos no encontrado. Creando nuevo archivo.');
                await this.saveCarts();
            } else {
                console.error('Error al cargar los carritos:', error);
            }
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2));
            console.log('Carritos guardados exitosamente.');
        } catch (error) {
            console.error('Error al guardar los carritos:', error);
        }
    }

    addCart(cart) {
        cart.id = this.nextId++;
        this.carts.push(cart);
        this.saveCarts();
    }

    getCartById(id) {
        const cart = this.carts.find(c => c.id === id);
        if (cart) {
            return cart;
        } else {
            console.log("No se encontró el carrito");
        }
    }

    addProductToCart(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);
        if (cart) {
            const existingProductIndex = cart.products.findIndex(p => p.id === productId);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ id: productId, quantity });
            }
            this.saveCarts();
        }
    }
}

module.exports = CartManager;
