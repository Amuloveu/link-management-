const express = require('express')
const authMiddleware = require('../controller/authController')
const router = express.Router()

router.post('/register', authMiddleware.register)
router.post('/login', authMiddleware.login)

module.exports = router