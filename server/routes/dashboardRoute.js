const express = require('express');
const router = express.Router()
const getDashboardStats = require('../controller/dashboard')
const authMiddleware = require('../middlware/authMiddleware')
router.get('/dashboard',authMiddleware(),getDashboardStats.getDashboardStats)

module.exports = router