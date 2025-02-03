class User {
    constructor(id, name, email, password, isVerified = false, authProvider = "local", googleId = null, createdAt = new Date()) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.isVerified = isVerified;
        this.authProvider = authProvider;
        this.googleId = googleId;
        this.createdAt = createdAt;
    }
}
module.exports = User;
