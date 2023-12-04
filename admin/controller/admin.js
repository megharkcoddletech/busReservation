const adminDb = require('../model/admin');

async function addBus(req, res) {
  try {
    const {
      name, busNumber, type, farePerKm, ratings, status,
    } = req.body;
    const addBusQuery = await adminDb.addBus(name, busNumber, type, farePerKm, ratings, status);
    if (name === undefined || busNumber === undefined || type === undefined
    || farePerKm === undefined || ratings === undefined || status === undefined) {
      res.status(400).json({ success: 'false', message: 'enter all values' });
    }
    if (addBusQuery.length > 0) {
      res.status(200).json({ success: 'false', message: 'bus already exists' });
    } else {
      res.status(200).json({ success: 'true', message: 'bus added' });
    }
  } catch (err) {
    res.status(500).json({ success: 'false', message: 'internal server error' });
  }
}

const getBus = async (req, res) => {
  try {
    const { startingPoint, destination, boardingTime } = req.body;
    const { body } = req;
    const buses = await adminDb.viewBus(startingPoint, destination, boardingTime);
    if (buses.length > 0) {
      if (body.startingPoint != null && body.destination != null && body.boardingTime != null) {
        res.status(200).json({ success: 'true', result: buses });
      } else if (body.startingPoint != null && body.destination != null
        && body.boardingTime === undefined) {
        res.status(200).json({ success: 'true', result: buses });
      } else if (body.startingPoint != null && body.destination === undefined
        && body.boardingTime === undefined) {
        res.status(200).json({ success: 'true', result: buses });
      } else {
        res.status(200).json({ success: 'true', result: buses });
      }
    } else {
      res.status(400).json({ success: 'false', message: 'error occurred' });
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
      if (date === undefined) {
        res.status(200).json({ success: 'true', result: viewBookings });
      } else if (date != null) {
        res.status(200).json({ success: 'true', result: viewBookings });
      } else {
        res.status(400).json({ success: 'false', message: 'error' });
      }
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
    res.status(200).json({ success: 'true', message: currentOffers });
  } catch (err) {
    res.status(500).json({ success: 'false', message: 'internal server error' });
  }
};

const viewTickets = async (req, res) => {
  try {
    const {
      customerId, busId, bookingId, startDate, endDate, limit,
    } = req.body;
    const tickets = await adminDb.viewTicket(
      customerId,
      busId,
      bookingId,
      startDate,
      endDate,
      limit,
    );
    if (tickets.length > 0) {
      if (!startDate || !endDate) {
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

module.exports = {
  addBus,
  getBus,
  viewBooking,
  viewOffers,
  viewTickets,
};
