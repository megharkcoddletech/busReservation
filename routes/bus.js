const express = require("express");
const router = express.Router();
const busController = require("../controllers/bus");
router.get('/viewBuses',busController.getBus);
module.exports = router;