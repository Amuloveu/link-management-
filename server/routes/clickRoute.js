const express = require("express");
const router = express.Router();

const clickController = require("../controller/clickController");

router.get("/:alias", clickController.redirectLink);

module.exports = router 