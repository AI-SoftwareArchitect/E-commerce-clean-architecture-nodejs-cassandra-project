// verify.route.js
const express = require('express');
const router = express.Router();
const VerifyController = require('../adapters/controllers/verify.controller'); // Doğru yolu kontrol edin

const verifyController = new VerifyController();

// /verify/verify-email rotasını yönlendir
router.get('/verify-email', verifyController.verify);

module.exports = router;
