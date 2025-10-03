const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlware/authMiddleware');
const {
  addLink,
  getAllLinks,
  updateLink,
  deleteLink,
  getLinkById
} = require("../controller/linkController");

// Add link
router.post('/add', authMiddleware(), addLink);

// Get all links
router.get('/all', authMiddleware(), getAllLinks);
router.get("/:linkId", authMiddleware(), getLinkById);
// Update link
router.put('/:linkId', authMiddleware(), updateLink);

// // Delete link
// router.delete('/delete/:linkId', authMiddleware(), deleteLink);

module.exports = router;
