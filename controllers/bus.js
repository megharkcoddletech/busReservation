const busDb = require('../models/bus');

const addBus = async (req, res) => {
     try {
          const { name, bus_number, type, fare_per_km, ratings, status } = req.body;
          const addBusQuery = await busDb.addBus(name, bus_number, type, fare_per_km, ratings, status);
          if (name == null || bus_number == null || type == null || fare_per_km == null || ratings == null || status == null) {
               res.status(400).json({ success: "false", message: "enter all values" });
          }
          else {
               res.status(200).json({ success: "true", message: "bus added" });
          }
     }
     catch {
          res.status(500).json({ success: "false", message: "internal server error" });
     }
}

const getBus = async (req, res) => {
     try {
          const { starting_point, destination, boarding_time } = req.body;
          const body = req.body;
          const buses = await busDb.viewBus(starting_point, destination, boarding_time);
          if (buses.length > 0) {
               if (body.starting_point != null && body.destination != null && body.boarding_time != null) {
                    res.status(200).json({ success: "true", result: buses });
               } else if (body.starting_point != null && body.destination != null && body.boarding_time === null) {
                    res.status(200).json({ success: "true", result: buses });
               } else {
                    res.status(200).json({ success: "true", result: buses });
               }
          } else {
               res.status(400).json({ success: "false", message: "error occurred" });
          }
     }
     catch (err) {
          res.status(500).json({ success: "false", message: "internal server error" });
     }

};

const booking = async (req, res) => {
     try {
          const { customer_id, bus_id, date, no_of_seats, total_amount, status } = req.body;
          const addBooking = await busDb.booking(customer_id, bus_id, date, no_of_seats, total_amount, status);
          if (customer_id == null || bus_id == null || date == null || no_of_seats == null || total_amount == null) {
               res.status(400).json({ success: "false", message: "enter all values" });
          }
          else {
               res.status(200).json({ success: "true", message: "booking succesfull" });
          }
     }
     catch {
          res.status(500).json({ success: "false", message: "internal server error" });
     }
}

const viewBooking = async (req, res) => {

     try {
          const { date } = req.body;
          const viewBooking = await busDb.viewBooking(date);
          if (viewBooking.length > 0) {
               if (date == null) {
                    res.status(200).json({ success: "true", result: viewBooking });
               }
               else if (date != null) {
                    res.status(200).json({ success: "true", result: viewBooking });
               }
               else {
                    res.status(400).json({ success: "false", message: "error" });
               }
          }
          else {
               res.status(200).json({ success: "true", message: "no bookings" });
          }
     }
     catch (err) {
          res.status(500).json({ success: "true", message: "internal server error" });
     }
}

const viewOffers = async (req, res) => {
     try {
          const current_Offers = await busDb.viewOffers();
          res.status(200).json({ success: "true", message: current_Offers });
     }
     catch (err) {
          res.status(500).json({ success: "false", message: "internal server error" });
     }
}

module.exports = {
     getBus,
     booking,
     viewBooking,
     addBus,
     viewOffers
}
