const busDb = require('../models/bus');

const addBus = async (req, res) => {
     try {
          const { name, busNumber, type, farePerKm, ratings, status } = req.body;
          const addBusQuery = await busDb.addBus(name, busNumber, type, farePerKm, ratings, status);
          if(addBusQuery.length > 0){
               res.status(200).json({success:"false", message : "bus already exists"})
          }
          if (name === undefined || busNumber === undefined || type === undefined || farePerKm === undefined || ratings === undefined || status === undefined) {
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
          const { startingPoint, destination, boardingTime } = req.body;
          const body = req.body;
          const buses = await busDb.viewBus(startingPoint, destination, boardingTime);
          if (buses.length > 0) {
               if (body.startingPoint != null && body.destination != null && body.boardingTime != null) {
                    res.status(200).json({ success: "true", result: buses });
               } else if (body.startingPoint != null && body.destination != null && body.boardingTime === undefined) {
                    res.status(200).json({ success: "true", result: buses });
               }
               else if(body.startingPoint != null && body.destination === undefined && body.boardingTime === undefined){
                    res.status(200).json({success:"true", result : buses});
               } 
               else {
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

          const { customerId, busId, date, noOfSeats, totalAmount, status,seatsId } = req.body;
          const addBooking = await busDb.booking(customerId, busId, date, noOfSeats, totalAmount, status,seatsId);
          if(addBooking.length > 0 && addBooking.seatsId != null){
               res.status(404).json({success: "false", message:"booking already exists"});
          }
          if (customerId === undefined || busId === undefined || date === undefined || noOfSeats === undefined || totalAmount === undefined) {
               res.status(400).json({ success: "false", message: "enter all values" });
          }else if (addBooking.error_type == 1){
               res.status(200).json
               ({ success: "true", message: addBooking.message });
          }
          else {
               res.status(200).json({ success: "true", message: "booking succesfull" });
          }
     }
     catch(err) {
          res.status(500).json({ success: "false", message: "internal server error" });
     }

     
}

const viewBooking = async (req, res) => {

     try {
          const { date } = req.body;
          const viewBooking = await busDb.viewBooking(date);
          if (viewBooking.length > 0) {
               if (date === undefined) {
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
          res.status(500).json({ success: "false", message: "internal server error" });
     }
}

const viewOffers = async (req, res) => {
     try {
          const currentOffers = await busDb.viewOffers();
          res.status(200).json({ success: "true", message: currentOffers });
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


   