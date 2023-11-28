const busDb = require('../models/bus');

async function addBus(req, res) {
  try {
    const {
      name, busNumber, type, farePerKm, ratings, status,
    } = req.body;
    const addBusQuery = await busDb.addBus(name, busNumber, type, farePerKm, ratings, status);
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
    const buses = await busDb.viewBus(startingPoint, destination, boardingTime);
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

const booking = async (req, res) => {
  try {
    const {
      customerId,
      busId,
      date,
      noOfSeats,
      totalAmount,
      status,
      seatsId,
    } = req.body;
    const addBooking = await busDb.booking(
      customerId,
      busId,
      date,
      noOfSeats,
      totalAmount,
      status,
      seatsId,
    );
    if (addBooking.length > 0 && addBooking.seatsId != null) {
      res.status(404).json({ success: 'false', message: 'booking already exists' });
    }
    if (customerId === undefined || busId === undefined
      || date === undefined || noOfSeats === undefined || totalAmount === undefined) {
      res.status(400).json({ success: 'false', message: 'enter all values' });
    } else if (addBooking.errorType !== 1) {
      res.status(200).json({ success: 'false', message: addBooking.message });
    } else {
      res.status(200).json({ success: 'true', message: addBooking.message });
    }
  } catch (err) {
    res.status(500).json({ success: 'false', message: 'internal server error' });
  }
};

const viewBooking = async (req, res) => {
  try {
    const { date } = req.body;
    const viewBookings = await busDb.viewBooking(date);
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
    const currentOffers = await busDb.viewOffers();
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
    const tickets = await busDb.viewTicket(customerId, busId, bookingId, startDate, endDate, limit);
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

const budAmenities = async (req, res) => {
  try {
    const { id, startingPoint, destination } = req.body;
    const amenities = await busDb.viewAmenities(id, startingPoint, destination);
    if (amenities.length > 0) {
      if (!id && !startingPoint && !destination) {
        res.status(200).json({ success: 'true', message: amenities });
      } else if (!startingPoint && !destination) {
        res.status(200).json({ success: 'true', message: amenities });
      } else {
        res.status(200).json({ success: 'true', message: amenities });
      }
    } else {
      res.status(500).json({ success: 'false', message: 'internal server error' });
    }
  } catch (err) {
    console.log(err);
  }
};

const policies = async (req, res) => {
  try {
    const allPolicies = await busDb.bookingPolicies();
    if (allPolicies.length > 0) {
      res.status(200).json({ success: 'true', message: allPolicies });
    } else {
      res.status(500).json({ success: 'true', message: 'error occured' });
    }
  } catch (err) {
    console.log(err);
  }
};

const bookingCancel = async (req, res) => {
  try {
    const { bookingId, seatsToCancel } = req.body;
    const cancelBooking = await busDb.cancelBookings(bookingId, seatsToCancel);

    if (cancelBooking) {
      res.status(200).json({ success: true, message: 'booking canceled' });
    } else {
      res.status(400).json({ success: false, message: 'error occurred' });
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getBus,
  booking,
  viewBooking,
  addBus,
  viewOffers,
  viewTickets,
  budAmenities,
  policies,
  bookingCancel,
};
