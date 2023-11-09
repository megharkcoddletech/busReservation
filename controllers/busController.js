
const busModel = require('../models/busModels');

const getBusController = async(req, res) => {
    const { starting_point, destination } = req.body;
    const busController = await busModel.viewBus(starting_point, destination, (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: "internal server error" });
        } else if (result.length > 0) {
            if(starting_point=== null && destination=== null){ 
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
};

module.exports = {
    getBusController
}
