const Cart = require('../models/cart');

class CartManager {


    async addCart() {
        try {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            console.log('Carrito creado correctamente:', newCart);
            return newCart;
        } catch (error) {
            console.error('Error al crear carrito:', error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (cart) {
                console.log('Carrito obtenido correctamente:', cart);
                return cart;
            } else {
                throw new Error('Carrito no encontrado');
            }
        } catch (error) {
            console.error('Error al obtener carrito por ID:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const existingProductIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }

            await cart.save();
            console.log('Producto agregado al carrito correctamente:', cart);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }
}

module.exports = CartManager;
