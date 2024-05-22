const fs = require('fs');
const path = require('path');

class CartManager {
    constructor() {
        this.filePath = path.join(__dirname, 'carts.json');
    }

    async loadCarts() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar carritos desde el sistema de archivos:', error);
            throw error;
        }
    }

    async addCart() {
        try {
            const carts = await this.loadCarts();
            const newCart = { id: Date.now().toString(), products: [] };
            carts.push(newCart);
            await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            console.log('Carrito creado correctamente:', newCart);
            return newCart;
        } catch (error) {
            console.error('Error al crear carrito en el sistema de archivos:', error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const carts = await this.loadCarts();
            const cart = carts.find(c => c.id === cartId);
            if (cart) {
                console.log('Carrito obtenido correctamente:', cart);
                return cart;
            } else {
                throw new Error('Carrito no encontrado');
            }
        } catch (error) {
            console.error('Error al obtener carrito por ID desde el sistema de archivos:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const carts = await this.loadCarts();
            const cart = carts.find(c => c.id === cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const existingProductIndex = cart.products.findIndex(p => p.productId === productId);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }

            await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            console.log('Producto agregado al carrito correctamente:', cart);
        } catch (error) {
            console.error('Error al agregar producto al carrito en el sistema de archivos:', error);
            throw error;
        }
    }
}

module.exports = CartManager;
