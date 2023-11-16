const express = require("express");
const router = express.Router();
const busController = require("../controllers/bus");
const { verifyToken } = require("../middleware/middleWare");
router.get('/viewBuses', verifyToken,busController.getBus);
router.post('/addBooking', verifyToken,busController.booking);
router.get('/viewBooking', verifyToken, busController.viewBooking);
router.get('/viewOffers', verifyToken, busController.viewOffers);
router.post('/addBus',busController.addBus);

module.exports = router;