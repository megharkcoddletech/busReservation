const adminDb = require('../model/admin');

async function addBus(req, res) {
  try {
    const {
      name, busNumber, type, farePerKm, ratings, status,
    } = req.body;
    if (name === undefined || busNumber === undefined || type === undefined
      || farePerKm === undefined || ratings === undefined || status === undefined) {
      res.status(400).json({ success: 'false', message: 'enter all values' });
    } else {
      const addBusQuery = await adminDb.addBus(name, busNumber, type, farePerKm, ratings, status);
      if (addBusQuery.length > 0) {
        res.status(200).json({ success: 'false', message: 'bus already exists' });
      } else {
        res.status(200).json({ success: 'true', message: 'bus added' });
      }
    }
  } catch (err) {
    res.status(500).json({ success: 'false', message: 'internal server error' });
  }
}

const getBus = async (req, res) => {
  try {
    const { startingPoint, destination, boardingTime } = req.body;
    const buses = await adminDb.viewBus(startingPoint, destination, boardingTime);
    if (buses.length > 0) {
      res.status(200).json({ success: 'true', result: buses });
    } else {
      res.status(400).json({ success: 'false', message: 'no bus available' });
    }
  } catch (err) {
    res.status(500).json({ success: 'false', message: 'internal server error' });
  }
};

const viewBooking = async (req, res) => {
  try {
    const { date } = req.body;
    const viewBookings = await adminDb.viewBooking(date);
    if (viewBookings.length > 0) {
      res.status(200).json({ success: 'true', result: viewBookings });
    } else {
      res.status(200).json({ success: 'true', message: 'no bookings' });
    }
  } catch (err) {
    res.status(500).json({ success: 'false', message: 'internal server error' });
  }
};

const viewOffers = async (req, res) => {
  try {
    const currentOffers = await adminDb.viewOffers();
    if (currentOffers.length > 0) {
      res.status(200).json({ success: 'true', message: currentOffers });
    } else {
      res.status(200).json({ success: true, message: 'no offer exists' });
    }
  } catch (err) {
    res.status(500).json({ success: 'false', message: 'internal server error' });
  }
};

const viewTickets = async (req, res) => {
  try {
    const {
      customerId, busId, bookingId, startDate, endDate, limit,
    } = req.body;
    if (!customerId || !busId || !bookingId) {
      res.status(400).json({ success: false, message: 'enter details' });
    } else {
      const tickets = await adminDb.viewTicket(
        customerId,
        busId,
        bookingId,
        startDate,
        endDate,
        limit,
      );
      if (tickets.length > 0) {
        res.status(200).json({ success: 'true', message: tickets });
      } else {
        res.status(200).json({ success: 'true', message: tickets });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: 'false', message: err });
  }
};

const addOffer = async (req, res) => {
  try {
    const {
      busId, offerName, offerDescription, rate, StartDate, endDate, seatType,
    } = req.body;
    if (!offerName || !offerDescription
      || !rate || !StartDate || !endDate || !seatType) {
      res.status(400).json({ success: false, message: 'enter details' });
    } else {
      const offer = await adminDb.addOffer(
        busId,
        offerName,
        offerDescription,
        rate,
        StartDate,
        endDate,
        seatType,
      );
      if (offer) {
        if (busId === undefined) {
          res.status(200).json({ success: true, message: 'offer added for all bus' });
        } else {
          res.status(200).json({ success: true, message: `offer added for ${busId}` });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: 'false', message: err });
  }
};

const viewReview = async (req, res) => {
  try {
    const {
      busId,
    } = req.body;
    const review = await adminDb.viewReview(busId);
    if (review.length > 0) {
      res.status(200).json({ success: true, message: review });
    } else {
      res.status(400).json({ success: false, message: 'no reviews' });
    }
  } catch (err) {
    res.status(200).json({ success: false, message: err });
  }
};

module.exports = {
  addBus,
  getBus,
  viewBooking,
  viewOffers,
  viewTickets,
  addOffer,
  viewReview,
};
