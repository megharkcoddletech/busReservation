
const busModel = require('../models/busModels');

const getBusController = async(req, res) => {
    const { starting_point, destination, boarding_time} = req.body;
    const body = req.body;
    const busController = await busModel.viewBus(starting_point, destination, boarding_time,(err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: "internal server error" });
        } else if (result.length > 0) {
            if(body.starting_point=== null && body.destination=== null && body.boarding_time === null){ 
                res.status(200).json({success: "true", result})
            }
            else if(body.boarding_time === null){
                res.status(200).json({success: "true", result})
            }
            else{
                res.status(200).json({success: "true", result})
            }
        }
             else {
            res.status(400).json({ success: false });
        }

    });
    let result =await Promise.all([
        busController
    ])
    return result
};

module.exports = {
    getBusController
}
