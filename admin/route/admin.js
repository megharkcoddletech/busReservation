const express = require('express');

const adminController = require('../controller/admin');

const router = express.Router();

router.post('/addBus', adminController.addBus);

router.get('/viewBuses', adminController.getBus);

router.get('/viewBooking', adminController.viewBooking);

router.get('/viewOffers', adminController.viewOffers);

router.get('/viewTicket', adminController.viewTickets);

module.exports = router;
