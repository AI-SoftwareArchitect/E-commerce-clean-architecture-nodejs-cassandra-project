const { types } = require('cassandra-driver');

class UserRepository {
    constructor(cassandraClient) {
      if (!cassandraClient) {
        throw new Error('Cassandra client is required');
      }
      this.cassandraClient = cassandraClient;
      this.keyspace = 'mykeyspace';
      this.table = 'users';
    }
  
    async save(user) {
      const query = `INSERT INTO ${this.keyspace}.${this.table} 
                     (id, name, email, password, is_verified, auth_provider, google_id, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [user.id, user.name, user.email, user.password, user.isVerified, user.authProvider, user.googleId, user.createdAt];
      try {
        await this.cassandraClient.execute(query, params, { 
          prepare: true, 
          consistency: types.consistencies.quorum 
        });
      } catch (error) {
        console.error('Error saving user:', error);
        throw error;
      }
    }
  
    async update(userId, user) {
      const query = `UPDATE ${this.keyspace}.${this.table} 
                     SET name = ?, email = ?, password = ?, is_verified = ?, auth_provider = ?, google_id = ?, created_at = ?
                     WHERE id = ?`;
      const params = [user.name, user.email, user.password, user.isVerified, user.authProvider, user.googleId, user.createdAt, userId];
      try {
        await this.cassandraClient.execute(query, params, { 
          prepare: true, 
          consistency: types.consistencies.quorum 
        });
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    }
  
    async remove(userId) {
      const query = `DELETE FROM ${this.keyspace}.${this.table} WHERE id = ?`;
      try {
        await this.cassandraClient.execute(query, [userId], { 
          prepare: true, 
          consistency: types.consistencies.quorum 
        });
      } catch (error) {
        console.error('Error removing user:', error);
        throw error;
      }
    }
  
    async findById(userId) {
      const query = `SELECT * FROM ${this.keyspace}.${this.table} WHERE id = ?`;
      try {
        const result = await this.cassandraClient.execute(query, [userId], { 
          prepare: true, 
          consistency: types.consistencies.quorum 
        });
        return result.rows.length ? result.rows[0] : null;
      } catch (error) {
        console.error('Error finding user by ID:', error);
        throw error;
      }
    }
  
    async findByEmail(email) {
      const query = `SELECT * FROM ${this.keyspace}.${this.table} WHERE email = ? ALLOW FILTERING`;
      try {
        const result = await this.cassandraClient.execute(query, [email], { 
          prepare: true, 
          consistency: types.consistencies.quorum 
        });
        return result.rows.length ? result.rows[0] : null;
      } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
      }
    }
  
    async findAll() {
      const query = `SELECT * FROM ${this.keyspace}.${this.table}`;
      try {
        const result = await this.cassandraClient.execute(query, [], {
          prepare: true,
          consistency: types.consistencies.quorum
        });
        return result.rows;
      } catch (error) {
        console.error('Error finding all users:', error);
        throw error;
      }
    }
}

module.exports = UserRepository;