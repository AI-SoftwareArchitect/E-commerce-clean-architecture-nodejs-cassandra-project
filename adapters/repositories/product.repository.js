const Product = require('../../entity/product.entity');
const { Uuid } = require('cassandra-driver').types;

class ProductRepository {
    constructor(cassandraClient) {
        if (!cassandraClient) {
            throw new Error('Cassandra client is required');
        }
        this.cassandraClient = cassandraClient;
        this.keyspace = 'mykeyspace';
        this.table = 'products';
    }

    async createProduct(product) {
        const query = `
        INSERT INTO ${this.table} 
        (id, brand, seller_id, name, description, price, category_id, subcategory_id, stock_count, star, created_at, updated_at, deleted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;      
        const params = [
            product.id,product.brand, product.sellerId, product.name, product.description, product.price,
            product.categoryId, product.subcategoryId, product.stockCount, product.star,
            product.createdAt, product.updatedAt, product.deletedAt
        ];
        await this.cassandraClient.execute(query, params, { prepare: true });
        return product;
    }

    async getAllProducts() {
        const query = `SELECT * FROM ${this.table}`;
        const result = await this.cassandraClient.execute(query);
        
        // Dönen her satırı Product nesnesine dönüştürüyoruz
        return result.rows.map(row => {
            const product = new Product({
                id: row.id,
                sellerId: row.seller_id,
                name: row.name,
                description: row.description,
                price: row.price,
                categoryId: row.category_id,
                subcategoryId: row.subcategory_id,
                stockCount: row.stock_count,
                star: row.star,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
                deletedAt: row.deleted_at
            });
            return product;
        });
    }

    async getProductById(id) {
        const query = `SELECT * FROM ${this.table} WHERE id = ?`;
        const result = await this.cassandraClient.execute(query, [id], { prepare: true });
        if (result.rowLength === 0) return null;

        // Sadece ilk satırı döndürüp Product nesnesine dönüştürüyoruz
        const row = result.first();
        const product = new Product({
            id: row.id,
            sellerId: row.seller_id,
            name: row.name,
            description: row.description,
            price: row.price,
            categoryId: row.category_id,
            subcategoryId: row.subcategory_id,
            stockCount: row.stock_count,
            star: row.star,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            deletedAt: row.deleted_at
        });
        return product;
    }

    async getProductsBySellerId(sellerId) {
        // ALLOW FILTERING ekledik; Cassandra’da bu tür sorgular için gerekebilir
        const query = `SELECT * FROM ${this.table} WHERE seller_id = ? ALLOW FILTERING`;
        const result = await this.cassandraClient.execute(query, [sellerId], { prepare: true });
        
        // Dönen her satırı Product nesnesine dönüştürüyoruz
        return result.rows.map(row => {
            const product = new Product({
                id: row.id,
                sellerId: row.seller_id,
                name: row.name,
                description: row.description,
                price: row.price,
                categoryId: row.category_id,
                subcategoryId: row.subcategory_id,
                stockCount: row.stock_count,
                star: row.star,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
                deletedAt: row.deleted_at
            });
            return product;
        });
    }

    async updateProduct(product) {
        const query = `UPDATE ${this.table} SET 
                        name = ?, description = ?, price = ?, category_id = ?, 
                        subcategory_id = ?, stock_count = ?, star = ?, updated_at = ?
                        WHERE id = ?`;
        const params = [
            product.name, product.description, product.price, product.categoryId,
            product.subcategoryId, product.stockCount, product.star, product.updatedAt, product.id
        ];
        await this.cassandraClient.execute(query, params, { prepare: true });
        return product;
    }

    async deleteProduct(id) {
        // Soft delete işlemi: ürün kaydını silmek yerine 'deleted_at' alanını güncelliyoruz.
        const query = `UPDATE ${this.table} SET deleted_at = ? WHERE id = ?`;
        const deletedAt = new Date();
        await this.cassandraClient.execute(query, [deletedAt, id], { prepare: true });
        return { id, deletedAt };
    }
}

module.exports = ProductRepository;