const bookingdb = require('../model/booking');

const viewBooking = async (req, res) => {
  try {
    const { date } = req.body;
    const viewBookings = await bookingdb.viewBooking(date);
    if (viewBookings.length > 0) {
      res.status(200).json({ success: 'true', result: viewBookings });
    } else {
      res.status(200).json({ success: 'true', message: 'no bookings' });
    }
  } catch (err) {
    res.status(500).json({ success: 'false', message: 'internal server error' });
  }
};

const viewTickets = async (req, res) => {
  try {
    const {
      customerId, busId, bookingId, startDate, endDate, page = 1,
    } = req.body;
    if (!customerId || !busId) {
      res.status(400).json({ success: false, message: 'enter details' });
    } else {
      const tickets = await bookingdb.viewTicket(
        customerId,
        busId,
        bookingId,
        startDate,
        endDate,
        page,
      );
      if (tickets.length > 0) {
        res.status(200).json({
          success: 'true', message: tickets[0], totalPage: tickets[1], page: `${page}/${tickets[1]}`,
        });
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
  viewBooking,
  viewTickets,
};
