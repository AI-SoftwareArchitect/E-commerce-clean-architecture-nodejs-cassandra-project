const { Uuid } = require('cassandra-driver').types;

class Product {
    constructor({ id, sellerId, name, description, price, categoryId, subcategoryId, stockCount, star, createdAt, updatedAt, deletedAt }) {
        this.id = id || Uuid.random();
        this.sellerId = sellerId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.categoryId = categoryId;
        this.subcategoryId = subcategoryId;
        this.stockCount = stockCount || 0;
        this.star = star || 0;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
        this.deletedAt = deletedAt || null;

        this.validate();
    }

    validate() {
        if (!this.sellerId || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(this.sellerId)) {
            throw new Error("Invalid or missing Seller ID");
        }
        if (!this.name) throw new Error("Product name is required");
        if (this.price === undefined || this.price < 0) throw new Error("Price must be a positive number");
    }

    updateStock(amount) {
        if (this.stockCount + amount < 0) {
            throw new Error("Stock cannot be negative");
        }
        this.stockCount += amount;
        this.updatedAt = new Date();
    }

    softDelete() {
        this.deletedAt = new Date();
    }
}

module.exports = Product;
