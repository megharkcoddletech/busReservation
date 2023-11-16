const busdb = require('../db_connection');
const db = busdb.makeDb(busdb);

const addBus = async (name, busNumber, type, farePerKm, ratings, status) => {

  try {
    const bus = `select bus_number from bus where bus_number = ?`;
    const checkBus = await db.query(bus, [busNumber]);
    if (checkBus.length > 0) {
      return checkBus;
    }
    else {
      const addBusQuery = `insert into bus (name,bus_number, type, fare_per_km, ratings, status) values(?,?,?,?,?,?)`;
      const postBus = await db.query(addBusQuery, [name, busNumber, type, farePerKm, ratings, status]);
      return postBus;
    }
  }
  catch (err) {
    await db.close();
  }
}


const viewBus = async (startingPoint, destination, boardingTime) => {

  try {

    const getAllBus = `select bus.id, bus.name, bus.bus_number, bus.type, bus.fare_per_km, bus.ratings,
          bus.status,route.starting_point, route.destination, route.boarding_time, route.deboarding_time
          from bus inner join route on bus.id = route.bus_id limit 10`;
    const getBusByRoute = `select bus.id, bus.name, route.starting_point, route.destination, 
          route.boarding_time, route.deboarding_time FROM bus INNER JOIN route
          ON bus.id = route.bus_id WHERE route.starting_point = ? AND route.destination = ? limit 10`;

    const getBusByTime = `select bus.id, bus.name, route.starting_point, route.destination, 
          route.boarding_time, route.deboarding_time FROM bus INNER JOIN route
          ON bus.id = route.bus_id WHERE route.starting_point =? AND route.destination = ? and route.boarding_time = ?`;

    const startPointOnly = `select bus.id, bus.name, route.starting_point, route.destination, 
          route.boarding_time, route.deboarding_time FROM bus INNER JOIN route
          ON bus.id = route.bus_id WHERE route.starting_point = ? limit 10`;


    const allBus = await db.query(getAllBus);
    const startPointBus = await db.query(startPointOnly, [startingPoint]);
    const allROute = await db.query(getBusByRoute, [startingPoint, destination]);
    const allTime = await db.query(getBusByTime, [startingPoint, destination, boardingTime]);
    if (startingPoint != null && destination != null && boardingTime != null) {
      return allTime;
    }
    else if (startingPoint != null && destination != null && boardingTime === undefined) {
      return allROute
    }
    else if (startingPoint != null && destination === undefined && boardingTime === undefined) {
      return startPointBus;
    }
    else {
      return allBus
    }
  }
  catch (err) {
    await db.close();
  }

}

const booking = async (customerId, busId, date, noOfSeats, totalAmount, bookingStatus, seatsId, bookingId,
  seatStatus, passengerName, passengerEmail, passengerPhone, passengerAge) => {
  try {
    let generateTicket;
    const bookBus = `select id from seats where id not in (select ticket.seats_id
              from booking inner join bus on bus.id = booking.bus_id
               inner join ticket on booking.id = ticket.booking_id  inner join seats on 
              ticket.seats_id = seats.id where bus.id = ? and booking.date = ?)`;

    const checkBooking = await db.query(bookBus, [busId, date]);
    if (checkBooking) {
      let noOfSeat = noOfSeats;
      let messg;

      const bookingQuery = `insert into booking (customer_id, bus_id, date,no_of_seats, total_amount, status) values (?, ?, ?, ?, ?, ?)`;
      const addBooking = await db.query(bookingQuery, [customerId, busId, date, noOfSeat, totalAmount, bookingStatus]);
      const bookingIdQuery = `select id from booking where customer_id = ? AND date = ? AND bus_id = ?`;
      const booking_id = await db.query(bookingIdQuery, [customerId, date, busId]);

      for (let i of checkBooking) {
        for (let seats of seatsId) {
          if (i.id == seats.id) {
            let bookingSeatId
            for (let st of booking_id) {
              bookingSeatId = st.id; 
            }
            const addTicket = `insert into ticket (bus_id, booking_id, seats_id, status, passenger_name, passenger_email, passenger_phone,passenger_age) values (?, ?, ?, ?, ?, ?, ?, ?)`;
            generateTicket = await db.query(addTicket, [busId, bookingSeatId, seats.id, seatStatus, seats.passengerName, seats.passengerEmail, seats.passengerPhone, seats.passengerAge])

          }
        }
      }
      if (generateTicket) {
        messg = 'Seats Booked Successfully';
        return messg;

      } else {
        messg = 'Error generating Ticket';
        return { message: messg, error_type: 1 };
      }

    }

  }
  catch (err) {
    await db.close();
  }
}

const viewBooking = async (date) => {

  try {
    const bookingView = `select customer.name, bus.name as busname, booking.date,
          booking.no_of_seats as noOfSeats, booking.total_amount as totalAmount, booking.status,
          route.starting_point as startingPoint, route.destination, route.boarding_time as boardingTime, route.deboarding_time as deboardingTime from booking
          inner join customer on customer.id = booking.customer_id inner join bus on bus.id = booking.bus_id
          inner join route on bus.id = route.bus_id where booking.date = current_date() `;

    const filterByDate = `select customer.name, bus.id, bus.name as busName, booking.date,
          booking.no_of_seats as noOfSeats, booking.total_amount as totalAmount, booking.status,
          route.starting_point as startingPoint, route.destination, route.boarding_time as boardingTime, route.deboarding_time as deboardingTime from booking
          inner join customer on customer.id = booking.customer_id inner join bus on bus.id = booking.bus_id
          inner join route on bus.id = route.bus_id where booking.date = ?` ;

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
    return viewOffer;
  }
  catch (err) {
    await db.close();
  }
}



module.exports = {
  viewBus, addBus, booking, viewBooking, viewOffers
}



////added ticket query inside for loop
//aded booking query above that


