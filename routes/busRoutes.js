const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController");
router.get('/viewBuses',busController.getBusController);

module.exports = router;