const { Uuid } = require('cassandra-driver').types;
const Seller = require('../../entity/seller.entity');

class SellerRepository {
    constructor(cassandraClient) {
        if (!cassandraClient) {
            throw new Error('Cassandra client is required');
        }
        this.cassandraClient = cassandraClient;
        this.keyspace = 'mykeyspace';
        this.table = 'sellers';
    }

    async createSeller(seller) {
        const query = `INSERT INTO sellers (id, name, seller_name, email, password_hash, phone_number, address_id, tax_number, is_verified, balance, credit_card_id, created_at, updated_at, deleted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [
            seller.id || Uuid.random(), seller.name, seller.sellerName, seller.email, seller.passwordHash, seller.phoneNumber,
            seller.addressId, seller.taxNumber, seller.isVerified, seller.balance, seller.creditCardId,
            seller.createdAt || new Date(), seller.updatedAt || new Date(), seller.deletedAt || null
        ];
        await this.cassandraClient.execute(query, params, { prepare: true });
        return seller;
    }

    async getAllSellers() {
        const query = `SELECT * FROM ${this.table}`;
        const result = await this.cassandraClient.execute(query);
        if (result.rows.length === 0) {
            console.log("No sellers found in the database.");
            return [];
        }
        return result.rows;
    }

    async getSellerById(id) {
        const query = `SELECT * FROM ${this.table} WHERE id = ?`;
        const result = await this.cassandraClient.execute(query, [id], { prepare: true });
        if (result.rowLength === 0) return null;
        return new Seller(result.first());
    }

    async updateSeller(seller) {
        const query = `UPDATE ${this.table} SET
                        name = ?, seller_name = ?, email = ?, password_hash = ?, phone_number = ?,
                        address_id = ?, tax_number = ?, is_verified = ?, balance = ?, credit_card_id = ?,
                        updated_at = ?, deleted_at = ? WHERE id = ?`;
        const params = [
            seller.name, seller.sellerName, seller.email, seller.passwordHash, seller.phoneNumber,
            seller.addressId, seller.taxNumber, seller.isVerified, seller.balance, seller.creditCardId,
            seller.updatedAt || new Date(), seller.deletedAt || null, seller.id
        ];
        await this.cassandraClient.execute(query, params, { prepare: true });
        return seller;
    }
}

module.exports = SellerRepository;
