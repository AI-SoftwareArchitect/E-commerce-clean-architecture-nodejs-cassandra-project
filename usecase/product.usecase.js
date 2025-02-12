const Product = require('../entity/product.entity');

class ProductUseCase {
    constructor(productRepository, redis) {
        this.productRepository = productRepository;
        this.cache = redis;
    }

    async createProduct(data) {
        const product = new Product(data);
        await this.#setProductWithPipeline(product.id, product);
        return await this.productRepository.createProduct(product);
    }

    async getAllProducts() { 
        return await this.productRepository.getAllProducts();
    }

    async getProductById(id) {
        const cachedProduct = await this.cache.hget(`product:${id}`);
        if (cachedProduct) {
            return JSON.parse(cachedProduct);
        }
        
        const product = await this.productRepository.getProductById(id);
        if (product) {
            await this.#setProductWithPipeline(product.id, product);
        }
        return product;
    }

    async getProductsBySellerId(sellerId) {
        return await this.productRepository.getProductsBySellerId(sellerId);
    }

    async updateProduct(id, data) {
        const product = await this.getProductById(id);
        if (!product) throw new Error("Product not found");

        Object.assign(product, data);
        product.updatedAt = new Date();

        const updatedProduct = await this.productRepository.updateProduct(product);
        if (updatedProduct) {
            await this.#setProductWithPipeline(id, updatedProduct);
        }
        return updatedProduct;
    }

    async deleteProduct(id) {
        const deleted = await this.productRepository.deleteProduct(id);
        if (deleted) {
            await this.cache.del(`product:${id}`);
        }
        return deleted;
    }

    async #setProductWithPipeline(id, data) {
        const pipeline = this.cache.pipeline();
        pipeline.hset(`product:${id}`, JSON.stringify(data));
        pipeline.expire(`product:${id}`, 600);
        await pipeline.exec();
    }
}

module.exports = ProductUseCase;
