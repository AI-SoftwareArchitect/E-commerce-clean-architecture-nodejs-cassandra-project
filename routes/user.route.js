const express = require('express');
const Router = express.Router();
const cassandraClient = require('../frameworks/database');

const UserRepository = require('../adapters/repositories/user.repository');
const UserUseCase = require('../usecase/user.usecase');

const userRepository = new UserRepository(cassandraClient);
const userUseCase = new UserUseCase(userRepository);

const UserController = require('../adapters/controllers/user.controller');
const userController = new UserController(userUseCase);

Router.post('/save', userController.save.bind(userController));
Router.put('/update/:id', userController.update.bind(userController));
Router.delete('/remove/:id', userController.remove.bind(userController));
Router.get('/findById/:id', userController.findById.bind(userController));
Router.get('/findAll', userController.findAll.bind(userController));

module.exports = Router;
