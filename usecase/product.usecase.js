const Product = require('../entity/product.entity');

class ProductUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async createProduct(data) {
        // Data'nın Product entity'sine dönüşümü
        const product = new Product(data);
        return await this.productRepository.createProduct(product);
    }

    async getAllProducts() {
        return await this.productRepository.getAllProducts();
    }

    async getProductById(id) {
        return await this.productRepository.getProductById(id);
    }

    async getProductsBySellerId(sellerId) {
        return await this.productRepository.getProductsBySellerId(sellerId);
    }

    async updateProduct(id, data) {
        const product = await this.getProductById(id);
        if (!product) throw new Error("Product not found");

        // Esnek güncelleme: gelen data ile varolan ürünü güncelle
        Object.assign(product, data);
        product.updatedAt = new Date();
        return await this.productRepository.updateProduct(product);
    }

    async deleteProduct(id) {
        return await this.productRepository.deleteProduct(id);
    }
}

module.exports = ProductUseCase;
