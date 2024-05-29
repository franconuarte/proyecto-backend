const Product = require('../models/product.js');

class ProductManager {
    async getProducts({ limit = 5, page = 1, sort, query }) {
        try {
            let options = {};


            let filter = {};
            if (query) {
                filter = {
                    $or: [
                        { title: new RegExp(query, 'i') },
                        { description: new RegExp(query, 'i') },
                        { code: new RegExp(query, 'i') },
                        { category: new RegExp(query, 'i') },
                        { availability: query === 'true' || query === 'false' ? query === 'true' : undefined }
                    ]
                };
            }


            options.skip = (page - 1) * limit;
            options.limit = limit;


            if (sort) {
                options.sort = {};
                if (sort === 'asc') {
                    options.sort.price = 1;
                } else if (sort === 'desc') {
                    options.sort.price = -1;
                }
            }

            const products = await Product.find(filter, null, options);
            const totalProducts = await Product.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);

            return {
                status: 'success',
                payload: products,
                totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                page: parseInt(page),
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
            };
        } catch (error) {
            throw error;
        }
    }


    async getProductById(productId) {
        try {
            const product = await Product.findById(productId);
            return product;
        } catch (error) {
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();
            return product;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(productId, updatedDetails) {
        try {
            const product = await Product.findByIdAndUpdate(productId, updatedDetails, { new: true });
            return product;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            await Product.findByIdAndDelete(productId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductManager;
