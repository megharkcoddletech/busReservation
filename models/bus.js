const busdb = require('../db_connection');

const viewBus = async (starting_point, destination, boarding_time) => {
        let allArray = [];
        const getAllBus = `select * from bus`;
        const getBusByRoute = `select bus.name, route.starting_point, route.destination, 
        route.boarding_time, route.deboarding_time FROM bus INNER JOIN route
        ON bus.id = route.bus_id WHERE route.starting_point = ? AND route.destination = ?`;

        const getBusByTime = `select bus.name, route.starting_point, route.destination, 
        route.boarding_time, route.deboarding_time FROM bus INNER JOIN route
        ON bus.id = route.bus_id WHERE route.starting_point =? AND route.destination = ?  and route.boarding_time = ?`;

        const allBus = await busdb.con.promise().query(getAllBus);
        const allROute = await busdb.con.promise().query(getBusByRoute, [starting_point, destination]);
        const allTime = await busdb.con.promise().query(getBusByTime, [starting_point, destination, boarding_time]);
        if(starting_point!= null && destination != null && boarding_time != null){ 
            allArray.push(allTime);
        }
        else if(starting_point!= null && destination != null && boarding_time == null){
          allArray.push(allROute);
        }
        else {
           allArray.push(allBus)
        }
        return allArray;
}
 
const booking = async(customer_id, bus_id, date,no_of_seats, total_amount, status) =>{
  const bookingQuery = `insert into booking (customer_id, bus_id, date,no_of_seats, total_amount, status) values (?, ?, ?, ?, ?, ?)`;
  const addBooking = await busdb.con.promise().query(bookingQuery,[customer_id, bus_id, date,no_of_seats, total_amount, status]);
  return addBooking;
}

module.exports = {
    viewBus, booking
}

