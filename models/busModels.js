const busdb = require('../db_connection');
const viewBus = async (starting_point, destination, boarding_time) => {
    try {
        let allArrry = [];
        const getAllBus = `select * from bus`;
        const getBusByRoute = `select bus.name, route.starting_point, route.destination, 
        route.deboarding_time FROM bus INNER JOIN route
        ON bus.id = route.bus_id WHERE route.starting_point = ? AND route.destination = ?`;

        const getBusByTime = `select bus.name, route.starting_point, route.destination, 
        route.boarding_time, route.deboarding_time FROM bus INNER JOIN route
        ON bus.id = route.bus_id WHERE route.starting_point =? AND route.destination = ?  and route.boarding_time = ?`;

        const allBus = await busdb.con.promise().query(getAllBus);
        const allROute = await busdb.con.promise().query(getBusByRoute, [starting_point, destination]);
        const allTime = await busdb.con.promise().query(getBusByTime, [starting_point, destination, boarding_time]);
        if(starting_point!= null && destination != null && boarding_time != null){ 
            allArrry.push(allTime);
        }
        else if(starting_point!= null && destination != null && boarding_time == null){
          allArrry.push(allROute);
        }
        else {
           allArrry.push(allBus)
        }

        return allArrry;
    } catch (error) {
        console.log(error);
    }

}
module.exports = {
    viewBus
}

