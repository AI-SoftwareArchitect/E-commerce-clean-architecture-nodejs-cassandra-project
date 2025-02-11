const { Uuid } = require('cassandra-driver').types;
const Product = require('../../entity/product.entity');

class ProductController {
    constructor(productUseCase) {
        this.productUseCase = productUseCase;
    }

    async create(req, res) {
        try {
            const productData = req.body;
            productData.id = Uuid.random();
            const product = new Product(productData);
            const createdProduct = await this.productUseCase.createProduct(product);
            res.status(201).json(createdProduct);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        const products = await this.productUseCase.getAllProducts();
        res.json(products);
    }

    async getById(req, res) {
        const product = await this.productUseCase.getProductById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    }

    async getBySellerId(req, res) {
        const products = await this.productUseCase.getProductsBySellerId(req.params.sellerId);
        res.json(products);
    }

    async update(req, res) {
        try {
            const productData = req.body;
            productData.id = req.params.id;
            const product = new Product(productData);
            const updatedProduct = await this.productUseCase.updateProduct(req.params.id, product);
            res.json(updatedProduct);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        await this.productUseCase.deleteProduct(req.params.id);
        res.status(204).send();
    }
}

module.exports = ProductController;