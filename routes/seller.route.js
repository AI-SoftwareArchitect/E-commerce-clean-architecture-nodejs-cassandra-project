const express = require('express');
const cassandraClient = require('../frameworks/database'); // Cassandra client'ı burada al
const SellerRepository = require('../adapters/repositories/seller.repository');
const SellerUseCase = require('../usecase/seller.usecase');
const SellerController = require('../adapters/controllers/seller.controller');

if (!cassandraClient) {
    console.error("Cassandra client not initialized!");
    process.exit(1);
}

const router = express.Router();
const sellerRepository = new SellerRepository(cassandraClient);
const sellerUseCase = new SellerUseCase(sellerRepository);
const sellerController = new SellerController(sellerUseCase);

router.post('/', sellerController.register.bind(sellerController));
router.get('/', sellerController.getAllSellers.bind(sellerController));
router.get('/:id', sellerController.getSeller.bind(sellerController));

module.exports = router;
