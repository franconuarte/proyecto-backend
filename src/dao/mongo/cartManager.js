const Cart = require('../models/cart');

class CartManager {


    async addCart(userId) {
        try {
            const newCart = new Cart({ userId, products: [] }); // Asigna el ID del usuario al carrito
            await newCart.save();
            console.log('Carrito creado correctamente:', newCart);
            return newCart;
        } catch (error) {
            console.error('Error al crear carrito:', error);
            throw error;
        }
    }


    async getCart(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.productId');
            return cart;
        } catch (error) {
            console.error('Error al obtener carrito:', error);
            throw error;
        }
    }

    async addToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await Cart.findById(cartId);
            const index = cart.products.findIndex(item => item.productId.toString() === productId.toString());
            if (index !== -1) {
                cart.products[index].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
            await cart.save();
            console.log('Producto agregado al carrito correctamente:', cart);
            return cart;
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }

    async removeFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            cart.products = cart.products.filter(item => item.productId.toString() !== productId.toString());
            await cart.save();
            console.log('Producto eliminado del carrito correctamente:', cart);
            return cart;
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            cart.products = [];
            await cart.save();
            console.log('Carrito vaciado correctamente:', cart);
            return cart;
        } catch (error) {
            console.error('Error al vaciar carrito:', error);
            throw error;
        }
    }
}

module.exports = CartManager;
