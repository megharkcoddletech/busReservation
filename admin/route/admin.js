const express = require('express');

const adminController = require('../controller/admin');
const { verifyToken } = require('../../middleWare/middleWare');

const router = express.Router();

router.post('/addBus', verifyToken, adminController.addBus);

router.get('/viewBuses', verifyToken, adminController.getBus);

router.get('/viewBooking', verifyToken, adminController.viewBooking);

router.get('/viewOffers', verifyToken, adminController.viewOffers);

router.get('/viewTicket', verifyToken, adminController.viewTickets);

router.post('/addOffer', verifyToken, adminController.addOffer);
module.exports = router;
