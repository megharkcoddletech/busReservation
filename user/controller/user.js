const busDb = require('../model/user');

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
      customerId = 1,
      busId = 1,
      date = '2023-12-10',
      noOfSeats = 3,
      totalAmount = 399,
      status = 'booked',
      seatsId = [{
        id: 1, status: 'booked', passengerName: 'tt', passengerEmail: 'ev@gmail.com', passengerPhone: 565768798, passengerAge: '28',
      }, {
        id: 6, status: 'booked', passengerName: 'tt', passengerEmail: 'ev@gmail.com', passengerPhone: 565768798, passengerAge: '20',
      }, {
        id: 7, status: 'booked', passengerName: 'tt', passengerEmail: 'ev@gmail.com', passengerPhone: 565768798, passengerAge: '20',
      }],
    } = req.body;

    if (customerId === undefined || busId === undefined
      || date === undefined || noOfSeats === undefined || totalAmount === undefined) {
      res.status(400).json({ success: 'false', message: 'enter all values' });
      return;
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

    if (addBooking.length > 0 && addBooking.seatsId != null) {
      res.status(404).json({ success: 'false', message: 'booking already exists' });
    } else if (addBooking.errorType !== 1) {
      console.log('false', addBooking);
      res.status(200).json({ success: 'false', message: addBooking.message });
    } else if (addBooking.errorType !== 0) {
      res.status(400).send(`${addBooking.message}`);
    } else {
      console.log('true', addBooking);
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

const viewSeats = async (req, res) => {
  try {
    const {
      date = '2023-12-13',
    } = req.body;
    if (!date) {
      res.status(400).json({ message: 'enter the date ' });
    }
    const addBooking = await busDb.viewSeats(
      date,
    );
    if (addBooking.length < 0) {
      res.status(404).json({ success: 'false', message: 'booking already exists' });
    } else {
      res.status(200).json({ success: 'true', message: addBooking.message, offer: addBooking.off });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: 'false', message: 'internal server error' });
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
};
