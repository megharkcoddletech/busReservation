const busModel = require('../models/busModels');
const getBus = async(req, res) => {   
    const { starting_point, destination, boarding_time} = req.body;
    const body = req.body;
    const buses = await busModel.viewBus(starting_point, destination, boarding_time);
    if (buses.length > 0) {
      if (body.starting_point != null && body.destination != null && body.boarding_time != null) {
          return res.status(200).json({ success: "true", result: buses[0][0] });
      } else if (body.starting_point != null && body.destination != null && body.boarding_time === null) {
          return res.status(200).json({ success: "true", result: buses[0][0] });
      } else {
          return res.status(200).json({ success: "true", result: buses[0][0] });
      }
  } else {
      return res.status(400).json({ success: "false", message: "error occurred" });
  }

};
module.exports = {
    getBus
}
