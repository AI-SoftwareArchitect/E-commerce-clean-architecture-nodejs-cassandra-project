class UserRepository {
    constructor(cassandraClient) {
        if (!cassandraClient) {
            throw new Error('Cassandra client is required');
        }
        this.cassandraClient = cassandraClient;
        this.keyspace = 'mykeyspace';
        this.table = 'users';
    }

    // Kullanıcıyı kaydetme
    async save(user) {
        const query = `INSERT INTO ${this.keyspace}.${this.table} 
                       (id, name, email, password, is_verified, auth_provider, google_id, created_at) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [user.id, user.name, user.email, user.password, user.is_verified, user.auth_provider, user.google_id, user.created_at];
        try {
            await this.cassandraClient.execute(query, params, { prepare: true, consistency: cassandra.types.consistencies.quorum });
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }

    // Kullanıcıyı güncelleme
    async update(userId, user) {
        const query = `UPDATE ${this.keyspace}.${this.table} 
                       SET name = ?, email = ?, password = ?, is_verified = ?, auth_provider = ?, google_id = ?, created_at = ?
                       WHERE id = ?`;
        const params = [user.name, user.email, user.password, user.is_verified, user.auth_provider, user.google_id, user.created_at, userId];
        try {
            await this.cassandraClient.execute(query, params, { prepare: true, consistency: cassandra.types.consistencies.quorum });
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Kullanıcıyı silme
    async remove(userId) {
        const query = `DELETE FROM ${this.keyspace}.${this.table} WHERE id = ?`;
        try {
            await this.cassandraClient.execute(query, [userId], { prepare: true, consistency: cassandra.types.consistencies.quorum });
        } catch (error) {
            console.error('Error removing user:', error);
            throw error;
        }
    }

    // ID'ye göre kullanıcıyı bulma
    async findById(userId) {
        const query = `SELECT * FROM ${this.keyspace}.${this.table} WHERE id = ?`;
        try {
            const result = await this.cassandraClient.execute(query, [userId], { prepare: true, consistency: cassandra.types.consistencies.quorum });
            return result.rows.length ? result.rows[0] : null;  // Eğer kullanıcı bulunamazsa null döner
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    // E-posta adresine göre kullanıcıyı bulma (Google OAuth ile giriş yapanlar için)
    async findByEmail(email) {
        const query = `SELECT * FROM ${this.keyspace}.${this.table} WHERE email = ?`;
        try {
            const result = await this.cassandraClient.execute(query, [email], { prepare: true, consistency: cassandra.types.consistencies.quorum });
            return result.rows.length ? result.rows[0] : null;  // Eğer kullanıcı bulunamazsa null döner
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    // Tüm kullanıcıları bulma
    async findAll() {
        const query = `SELECT * FROM ${this.keyspace}.${this.table}`;
        try {
            const result = await this.cassandraClient.execute(query);
            return result.rows;  // Cassandra rows olarak döner
        } catch (error) {
            console.error('Error finding all users:', error);
            throw error;
        }
    }
}

module.exports = UserRepository;
