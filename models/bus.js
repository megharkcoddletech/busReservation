const busdb = require('../db_connection');
const addBus = async (name, bus_number, type, fare_per_km, ratings, status) => {
  const addBusQuery = `insert into bus (name,bus_number, type, fare_per_km, ratings, status) values(?,?,?,?,?,?)`;
  const postBus = await busdb.con.promise().query(addBusQuery, [name, bus_number, type, fare_per_km, ratings, status]);
  return postBus;
}
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
  if (starting_point != null && destination != null && boarding_time != null) {
    allArray.push(allTime);
  }
  else if (starting_point != null && destination != null && boarding_time == null) {
    allArray.push(allROute);
  }
  else {
    allArray.push(allBus)
  }
  return allArray;
}

const booking = async (customer_id, bus_id, date, no_of_seats, total_amount, status) => {
  const bookingQuery = `insert into booking (customer_id, bus_id, date,no_of_seats, total_amount, status) values (?, ?, ?, ?, ?, ?)`;
  const addBooking = await busdb.con.promise().query(bookingQuery, [customer_id, bus_id, date, no_of_seats, total_amount, status]);
  return addBooking;
}

const viewBooking = async (date) =>{
   
  let bookingArray = [];
  
  const bookingView = `select customer.name, bus.name as busname, booking.date,
                      booking.no_of_seats as no_of_seats, booking.total_amount as totalAmount, booking.status from booking
                      inner join customer on customer.id = booking.customer_id inner join bus on bus.id = booking.bus_id `;

  const filterByDate = `select customer.name, bus.name as busname, booking.date,
                        booking.no_of_seats as no_of_seats, booking.total_amount as totalAmount, booking.status from booking
                        inner join customer on customer.id = booking.customer_id inner join bus on bus.id = booking.bus_id where booking.date = ?` ;
  
  const allBooking = await busdb.con.promise().query(bookingView);
  const bookingFilter = await busdb.con.promise().query(filterByDate,[date]);

  if(date == null){
    bookingArray.push(allBooking);
  }
  else{
    bookingArray.push(bookingFilter);
  }
  return bookingArray;
}

  

module.exports = {
  viewBus, addBus, booking, viewBooking
}

