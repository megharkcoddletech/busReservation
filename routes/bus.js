const express = require("express");
const router = express.Router();
const busController = require("../controllers/bus");
router.get('/viewBuses', busController.getBus);
router.post('/addBooking', busController.booking);
router.get('/viewBooking', busController.viewBooking)

module.exports = router;