const busdb = require('../db_connection');

const viewBus = (starting_point,destination, callback)=>{
    getBus = `select bus.name, route.starting_point, route.destination, route.boarding_time, route.deboarding_time from bus inner join route on bus.id = route.bus_id where  route.starting_point= ? and route.destination =?`;
    busdb.con.query(getBus,[starting_point, destination],(err, result)=>{
        if(err){
            callback({error: "error"}, null);
        }
        else{
            callback(null, result);
        }
    })
}


module.exports = {
    viewBus
}