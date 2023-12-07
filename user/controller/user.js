const busDb = require('../model/user');

const getBus = async (req, res) => {
  try {
    const { startingPoint, destination, boardingTime } = req.body;
    const buses = await busDb.viewBus(startingPoint, destination, boardingTime);
    if (buses.length > 0) {
      res.status(200).json({ success: true, result: buses });
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

    if (customerId === undefined || busId === undefined
      || date === undefined || noOfSeats === undefined || totalAmount === undefined) {
      res.status(400).json({ success: 'false', message: 'enter all values' });
    }
    const addBooking = await busDb.booking(
      customerId,
      busId,
      date,
      noOfSeats,
      totalAmount,
      status,
      seatsId,
    );

    if (addBooking.length > 0 && addBooking.seatsId !== null) {
      res.status(404).json({ success: 'false', message: 'booking already exists' });
    } else {
      res.status(200).json({ success: 'true', message: addBooking.message });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: 'false', message: 'internal server error' });
  }
};

const viewBooking = async (req, res) => {
  try {
    const { date } = req.body;
    const viewBookings = await busDb.viewBooking(date);
    if (viewBookings.length > 0) {
      res.status(200).json({ success: 'true', result: viewBookings });
    } else {
      res.status(200).json({ success: 'false', message: 'no bookings' });
    }
  } catch (err) {
    res.status(500).json({ success: 'false', message: 'internal server error' });
  }
};

const viewOffers = async (req, res) => {
  try {
    const currentOffers = await busDb.viewOffers();
    if (currentOffers.length > 0) {
      res.status(200).json({ success: 'true', message: currentOffers });
    } else {
      res.status(200).json({ success: 'true', message: 'no offers' });
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
    const tickets = await busDb.viewTicket(customerId, busId, bookingId, startDate, endDate, limit);
    if (tickets.length > 0) {
      res.status(200).json({ success: 'true', message: tickets });
    } else {
      res.status(200).json({ success: 'true', message: 'no booking' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: 'false', message: err });
  }
};

const bookingCancel = async (req, res) => {
  try {
    const { bookingId, seatsToCancel } = req.body;
    const cancelBooking = await busDb.cancelBookings(bookingId, seatsToCancel);
    if (cancelBooking) {
      res.status(200).json({ success: true, message: 'booking canceled' });
    } else {
      res.status(400).json({ success: true, message: 'no bookings' });
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({ success: false, message: err });
  }
};

const viewSeats = async (req, res) => {
  try {
    const {
      date,
    } = req.body;
    if (!date) {
      res.status(400).json({ message: 'enter the date ' });
    } else {
      const addBooking = await busDb.viewSeats(
        date,
      );
      if (addBooking.length < 0) {
        res.status(404).json({ success: 'false', message: 'no seats available' });
      } else {
        res.status(200).json({ success: 'true', message: addBooking.message });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: 'false', message: 'internal server error' });
  }
};

const addReview = async (req, res) => {
  try {
    const {
      busId, customerId, review, suggestions,
    } = req.body;
    if (busId === undefined || customerId === undefined
      || review === undefined) {
      res.status(400).json({ success: false, message: 'enter all details' });
    } else {
      const reviewAdded = await busDb.busReview(busId, customerId, review, suggestions);
      if (reviewAdded) {
        res.status(200).json({ success: true, message: 'review added' });
      } else {
        res.status(400).json({ success: false, message: 'error occured' });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getBus,
  booking,
  viewBooking,
  viewOffers,
  viewTickets,
  bookingCancel,
  viewSeats,
  addReview,
};
