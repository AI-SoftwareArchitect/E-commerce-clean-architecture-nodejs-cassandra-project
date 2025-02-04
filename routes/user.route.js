const express = require('express');
const Router = express.Router();
const cassandraClient = require('../frameworks/database'); // Doğru path'i kontrol et

const UserRepository = require('../adapters/repositories/user.repository');
const userRepository = new UserRepository(cassandraClient);

const UserUseCase = require('../usecase/user.usecase');

const userUseCase = new UserUseCase(userRepository);

const UserController = require('../adapters/controllers/user.controller');
const userController = new UserController(userUseCase);

Router.post('/save', userController.save.bind(userController));
Router.put('/update/:id', userController.update.bind(userController));
Router.delete('/remove/:id', userController.remove.bind(userController));
Router.get('/findById/:id', userController.findById.bind(userController));
Router.get('/findAll', userController.findAll.bind(userController));
Router.post('/login-or-signup/google', userController.loginOrSignupGoogle.bind(userController));
Router.post('/signup', userController.signup.bind(userController));
Router.post('/login', userController.login.bind(userController));
Router.post('/refresh-token', userController.refreshToken.bind(userController));
Router.get('/verify',userController.verify.bind(userController));

module.exports = Router;
