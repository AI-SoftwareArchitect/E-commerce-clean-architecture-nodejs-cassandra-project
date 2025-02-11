const { Uuid } = require('cassandra-driver').types;

class Seller {
    constructor({ id, name, sellerName, email, passwordHash, phoneNumber, addressId, taxNumber, isVerified, balance, creditCardId, createdAt, updatedAt, deletedAt }) {
        this.id = id || Uuid.random();
        this.name = name;
        this.sellerName = sellerName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.phoneNumber = phoneNumber;
        this.addressId = addressId;
        this.taxNumber = taxNumber;
        this.isVerified = isVerified || false;
        this.balance = balance || 0;
        this.creditCardId = creditCardId;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
        this.deletedAt = deletedAt || null;

        this.validate();
    }

    validate() {
        if (!this.name) throw new Error("Seller name is required");
        if (!this.email) throw new Error("Seller email is required");
        if (!this.passwordHash) throw new Error("Password is required");
        if (!this.phoneNumber) throw new Error("Phone number is required");
        if (!this.taxNumber) throw new Error("Tax number is required");
    }

    updateBalance(amount) {
        if (amount < 0 && Math.abs(amount) > this.balance) {
            throw new Error("Insufficient balance");
        }
        this.balance += amount;
        this.updatedAt = new Date();
    }

    markAsVerified() {
        this.isVerified = true;
        this.updatedAt = new Date();
    }

    softDelete() {
        this.deletedAt = new Date();
    }
}

module.exports = Seller;
