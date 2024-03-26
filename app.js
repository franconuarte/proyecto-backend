class ProductManager {
    constructor() {
        this.products = []
        this.nextId = 1
    }

    addProduct(product) {
        if (!this.isProductValid(product)) {
            console.log("Producto no valido");
            return
        }

        if (this.isCodeDuplicate(product.code)) {
            console.log("El codigo del producto esta duplicado");
            return
        }

        product.id = this.nextId++
        this.products.push(product)
    }

    getProducts() {
        return this.products
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id === id)
        if (product) {
            return product
        } else {
            console.log("No se encuentra el producto");
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
        )
    }

    isCodeDuplicate(code) {
        return this.products.some((p) => p.code === code)
    }

}

const productManager = new ProductManager()

productManager.addProduct({
    title: "Producto 1",
    description: "Descripcion",
    price: 15560,
    thumbnail: '/imagen1.jpg',
    code: 'P001',
    stock: 10
})

productManager.addProduct({
    title: "Producto 2",
    description: "Descripcion",
    price: 5400,
    thumbnail: '/imagen2.jpg',
    code: 'P002',
    stock: 7
})

productManager.addProduct({
    title: "Producto 3",
    description: "Descripcion",
    price: 7000,
    thumbnail: '/imagen3.jpg',
    code: 'P003',
    stock: 2
})

productManager.addProduct({
    title: "Producto 4",
    description: "Descripcion",
    price: 20250,
    thumbnail: '/imagen4.jpg',
    code: 'P004',
    stock: 13
})

const productos = productManager.getProducts()
console.log(productos);
