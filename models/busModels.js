const busdb = require('../db_connection');

const viewBus = async(starting_point, destination, boarding_time)=>{
    const getAllBus = `select * from bus`;
    const getBusByRoute = `select bus.name, route.starting_point, route.destination, 
    route.boarding_time, route.deboarding_time FROM bus INNER JOIN route
     ON bus.id = route.bus_id WHERE route.starting_point = ? AND route.destination = ?`;
   
   const getBusByTime = `select bus.name, route.starting_point, route.destination, 
   route.boarding_time, route.deboarding_time FROM bus INNER JOIN route
    ON bus.id = route.bus_id WHERE route.starting_point =? AND route.destination = ?  and route.boarding_time = ?;`
 let results = await Promise.all(([
    busdb.con.promise().query(getAllBus),
    busdb.con.promise().query(getBusByRoute, [starting_point, destination]),
    busdb.con.promise().query(getBusByTime, [starting_point, destination, boarding_time])
 ]))

 return results;

}

module.exports ={
    viewBus
}