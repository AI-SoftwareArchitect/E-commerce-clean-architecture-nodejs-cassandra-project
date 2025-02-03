const { v4: uuidv4 } = require('uuid');

class UserController {
    constructor(userUseCase) {
        this.userUseCase = userUseCase;
    }

    async save(req, res) {
        const { name, email, password } = req.body;
        try {
            const id = uuidv4();
            await this.userUseCase.save({ id, name, email, password });
            res.status(201).send('successfull!');
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async update(req, res) {
        const userId = req.params.id;
        const { name, email, password } = req.body;
        try {
            await this.userUseCase.update(userId, { name, email, password });
            res.status(200).send('successfull!');
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async remove(req, res) {
        const userId = req.params.id;
        try {
            await this.userUseCase.remove(userId);
            res.status(200).send('successfull!');
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async findById(req, res) {
        const userId = req.params.id;
        try {
            const user = await this.userUseCase.findById(userId);
            res.status(200).send(user);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async findAll(req, res) {
        try {
            const users = await this.userUseCase.findAll();
            res.status(200).send(users);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = UserController; // Burada UserController'ı dışa aktar
