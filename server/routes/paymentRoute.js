const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlware/authMiddleware')
const paymentController = require('../controller/paymentController')

router.post('/pay', authMiddleware(), paymentController.initPayment)
router.get('/verify', paymentController.verifyPayment)

module.exports = router