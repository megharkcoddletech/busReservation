const express = require('express');

const router = express.Router();

const bus = require('../controller/user');

const { verifyToken } = require('../../middleWare/middleWare');

router.get('/viewBuses', bus.getBus);
router.post('/addBooking', bus.booking);
router.get('/viewBooking', verifyToken, bus.viewBooking);
router.get('/viewOffers', verifyToken, bus.viewOffers);
router.get('/viewTicket', verifyToken, bus.viewTickets);
router.put('/cancelBooking', verifyToken, bus.bookingCancel);
router.get('/adBooking', bus.booking);
router.get('/viewSeats', bus.viewSeats);

module.exports = router;
