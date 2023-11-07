const busModel = require('../models/busModels');


const getBusController = (req, res) => {
    busModel.viewBus((err,result)=>{ 
            if(err){
                res.status(500).json({success: "false"})
            }
            else if (result.length > 0){
                res.status(200).json({success: "true",result})
            }
            else{
                res.status(400).json({success: "false"})
            }
        }
    );
};

module.exports ={
    getBusController
}