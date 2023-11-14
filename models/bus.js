const busdb = require('../db_connection');
const db = busdb.makeDb(busdb);

const addBus = async (name, bus_number, type, fare_per_km, ratings, status) => {

  try {
    const addBusQuery = `insert into bus (name,bus_number, type, fare_per_km, ratings, status) values(?,?,?,?,?,?)`;
    const postBus = await db.query(addBusQuery, [name, bus_number, type, fare_per_km, ratings, status]);
    return postBus;
  }
  catch (err) {
    await db.close();
  }
}


const viewBus = async (starting_point, destination, boarding_time) => {

  try {

    const getAllBus = `select * from bus`;
    const getBusByRoute = `select bus.name, route.starting_point, route.destination, 
          route.boarding_time, route.deboarding_time FROM bus INNER JOIN route
          ON bus.id = route.bus_id WHERE route.starting_point = ? AND route.destination = ?`;

    const getBusByTime = `select bus.name, route.starting_point, route.destination, 
          route.boarding_time, route.deboarding_time FROM bus INNER JOIN route
          ON bus.id = route.bus_id WHERE route.starting_point =? AND route.destination = ?  and route.boarding_time = ?`;

    const allBus = await db.query(getAllBus);
    const allROute = await db.query(getBusByRoute, [starting_point, destination]);
    const allTime = await db.query(getBusByTime, [starting_point, destination, boarding_time]);
    if (starting_point != null && destination != null && boarding_time != null) {
      return allTime;
    }
    else if (starting_point != null && destination != null && boarding_time == null) {
      return allROute
    }
    else {
      return allBus
    }
  }
  catch (err) {
    await db.close();
  }

}

const booking = async (customer_id, bus_id, date, no_of_seats, total_amount, status) => {
  try {
    const bookingQuery = `insert into booking (customer_id, bus_id, date,no_of_seats, total_amount, status) values (?, ?, ?, ?, ?, ?)`;
    const addBooking = await db.query(bookingQuery, [customer_id, bus_id, date, no_of_seats, total_amount, status]);
    return addBooking;
  }
  catch (err) {
    await db.close();
  }
}

const viewBooking = async (date) => {

  try {
    const bookingView = `select customer.name, bus.name as busname, booking.date,
                         booking.no_of_seats as no_of_seats, booking.total_amount as totalAmount, booking.status from booking
                         inner join customer on customer.id = booking.customer_id inner join bus on bus.id = booking.bus_id where booking.date = current_date() `;

    const filterByDate = `select customer.name, bus.name as busname, booking.date,
                         booking.no_of_seats as no_of_seats, booking.total_amount as totalAmount, booking.status from booking
                         inner join customer on customer.id = booking.customer_id inner join bus on bus.id = booking.bus_id where booking.date = ?` ;

    const allBooking = await db.query(bookingView);
    const bookingFilter = await db.query(filterByDate, [date]);

    if (date != null) {
      return bookingFilter;
    }
    else {
      return allBooking;
    }
  }
  catch (err) {
    await db.close();
  }
}

const viewOffers = async () => {
  try {
    const viewQuery = `select * from offers where
             current_date() <= validity_ends and current_date()>= validaity_start `;
    const viewOffer = await db.query(viewQuery);   
    console.log("kk"+viewOffer);
    return viewOffer;
  }
  catch (err) {
    await db.close();
  }
}



module.exports = {
  viewBus, addBus, booking, viewBooking, viewOffers
}

