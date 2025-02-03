const user = require('../entity/user.entity');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class UserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async signUpWithEmailAndPassword(user) {
        const id = uuidv4();
        const password = await bcrypt.hash(user.password, 10);
        const user = User(
            id,
            user.name,
            user.email,
            password,
            
            
        );
        return this.userRepository.save(email,password);
    }

    async save(user) {
        this.userRepository.save(user);
    }

    async update(userId, user) {
        this.userRepository.update(userId, user);
    }

    async remove(userId) {
        this.userRepository.remove(userId);
    }

    async findById(userId) {
        return this.userRepository.findById(userId);
    }

    async findAll() {
        return this.userRepository.findAll();
    }
}

module.exports = UserUseCase;