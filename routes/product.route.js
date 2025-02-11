const express = require('express');
const ProductRepository = require('../adapters/repositories/product.repository');
const ProductUseCase = require('../usecase/product.usecase');
const ProductController = require('../adapters/controllers/product.controller');
const cassandraClient = require('../frameworks/database'); // Cassandra client'ı burada al

if (!cassandraClient) {
    console.error("Cassandra client not initialized!");
    process.exit(1);
}

const router = express.Router();
const productRepo = new ProductRepository(cassandraClient);
const productUseCase = new ProductUseCase(productRepo);
const productController = new ProductController(productUseCase);

router.post('/', (req, res) => productController.create(req, res));
router.get('/', (req, res) => productController.getAll(req, res));
router.get('/:id', (req, res) => productController.getById(req, res));
router.get('/seller/:sellerId', (req, res) => productController.getBySellerId(req, res));
router.put('/:id', (req, res) => productController.update(req, res));
router.delete('/:id', (req, res) => productController.delete(req, res));

module.exports = router;
