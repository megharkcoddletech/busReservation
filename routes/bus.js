const express = require('express');

const router = express.Router();

const busController = require('../controllers/bus');

const { verifyToken } = require('../middleWare/middleWare');

router.get('/viewBuses', verifyToken, busController.getBus);
router.post('/addBooking', verifyToken, busController.booking);
router.get('/viewBooking', verifyToken, busController.viewBooking);
router.get('/viewOffers', verifyToken, busController.viewOffers);
router.post('/addBus', busController.addBus);
router.get('/viewTicket', verifyToken, busController.viewTickets);
router.get('/viewAmenities', verifyToken, busController.budAmenities);
router.get('/viewPolicies', verifyToken, busController.policies);

module.exports = router;
