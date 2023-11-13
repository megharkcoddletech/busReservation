const busDb = require('../models/bus');

const getBus = async (req, res) => {
     const { starting_point, destination, boarding_time } = req.body;
     const body = req.body;
     const buses = await busDb.viewBus(starting_point, destination, boarding_time);
     if (buses.length > 0) {
          if (body.starting_point != null && body.destination != null && body.boarding_time != null) {
               res.status(200).json({ success: "true", result: buses[0][0] });
          } else if (body.starting_point != null && body.destination != null && body.boarding_time === null) {
               res.status(200).json({ success: "true", result: buses[0][0] });
          } else {
               res.status(200).json({ success: "true", result: buses[0][0] });
          }
     } else {
          res.status(400).json({ success: "false", message: "error occurred" });
     }

};

const booking = async (req, res) => {
     const { customer_id, bus_id, date, no_of_seats, total_amount, status } = req.body;
     const addBooking = await busDb.booking(customer_id, bus_id, date, no_of_seats, total_amount, status);
     if (customer_id == null || bus_id == null || date == null || no_of_seats == null || total_amount == null) {
          res.status(400).json({ success: "false", message: "enter all values" });
     }
     else {
          res.status(200).json({ success: "true", message: "booking succesfull" });
     }
}

const viewBooking = async (req, res) =>{
     const {date} = req.body;
     const viewBooking = await busDb.viewBooking(date);
     if(viewBooking.length > 0){
          if (date == null){
               res.status(200).json({success: "true", result: viewBooking[0][0]});
          }
          else if(date != null){
               res.status(200).json({success: "true", result: viewBooking[0][0]});
          }
          else{
               res.status(400).json({success:"false", message: "error"});
          }
     }
     else{
          res.status(500).json({success:"false", message: "internal server error"});
     }
} 

module.exports = {
     getBus,
     booking,
     viewBooking
}
