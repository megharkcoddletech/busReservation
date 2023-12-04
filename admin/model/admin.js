const adminDb = require('../../db_connection');

async function addBus(name, busNumber, type, farePerKm, ratings, status) {
  const db = adminDb.makeDb(adminDb);
  try {
    const bus = 'select bus_number from bus where bus_number = ?';
    const checkBus = await db.query(bus, [busNumber]);
    let result;
    if (checkBus.length > 0) {
      result = checkBus;
    } else {
      const addBusQuery = 'insert into bus (name, bus_number, type, fare_per_km, ratings, status) values(?,?,?,?,?,?)';
      const postBus = await db.query(
        addBusQuery,
        [name, busNumber, type, farePerKm, ratings, status],
      );
      result = postBus;
    }
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
}

async function viewBus(startingPoint, destination, boardingTime) {
  const db = adminDb.makeDb(adminDb);

  try {
    const getAllBus = `select bus.id, bus.name, bus.bus_number, bus.type, bus.fare_per_km, bus.ratings,
            bus.status,route.starting_point, route.destination, route.boarding_time, route.deboarding_time,
            booking_amenities.m_ticket, booking_amenities.cctv,
            booking_amenities.reading_light, booking_amenities.blanket,booking_amenities.charging_point,
            booking_amenities.emergency_contacts
            from bus inner join route on bus.id = route.bus_id inner join booking_amenities on
            booking_amenities.bus_id = bus.id limit 10`;
    const getBusByRoute = `select bus.id, bus.name, route.starting_point, route.destination, 
            route.boarding_time, route.deboarding_time, booking_amenities.m_ticket, booking_amenities.cctv,
            booking_amenities.reading_light, booking_amenities.blanket,booking_amenities.charging_point,
            booking_amenities.emergency_contacts FROM bus INNER JOIN route
            ON bus.id = route.bus_id inner join booking_amenities on 
            booking_amenities.bus_id = bus.id WHERE route.starting_point = ? AND route.destination = ? limit 10`;

    const getBusByTime = `select bus.id, bus.name, route.starting_point, route.destination, 
            route.boarding_time, route.deboarding_time, booking_amenities.m_ticket, booking_amenities.cctv,
            booking_amenities.reading_light, booking_amenities.blanket,booking_amenities.charging_point,
            booking_amenities.emergency_contacts FROM bus INNER JOIN route
            ON bus.id = route.bus_id inner join booking_amenities on booking_amenities.bus_id = bus.id
            WHERE route.starting_point =? AND route.destination = ? and route.boarding_time = ?`;

    const startPointOnly = `select bus.id, bus.name, route.starting_point, route.destination, 
            route.boarding_time, route.deboarding_time, booking_amenities.m_ticket, booking_amenities.cctv,
            booking_amenities.reading_light, booking_amenities.blanket,booking_amenities.charging_point,
            booking_amenities.emergency_contacts FROM bus INNER JOIN route
            ON bus.id = route.bus_id inner join booking_amenities on booking_amenities.bus_id = bus.id
            WHERE route.starting_point = ? limit 10`;

    const allBus = await db.query(getAllBus);
    const startPointBus = await db.query(startPointOnly, [startingPoint]);
    const allROute = await db.query(getBusByRoute, [startingPoint, destination]);
    const allTime = await db.query(getBusByTime, [startingPoint, destination, boardingTime]);
    if (startingPoint != null && destination != null && boardingTime != null) {
      return allTime;
    } if (startingPoint != null && destination != null && boardingTime === undefined) {
      return allROute;
    } if (startingPoint != null && destination === undefined && boardingTime === undefined) {
      return startPointBus;
    }
    return allBus;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
}

async function viewBooking(date) {
  const db = adminDb.makeDb(adminDb);

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
        inner join route on bus.id = route.bus_id where booking.date = ?`;

    const allBooking = await db.query(bookingView);
    const bookingFilter = await db.query(filterByDate, [date]);

    if (date != null) {
      return bookingFilter;
    }
    return allBooking;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
}

async function viewOffers() {
  const db = adminDb.makeDb(adminDb);

  try {
    const viewQuery = `select * from offers where
               current_date() <= validity_ends and current_date()>= validaity_start `;
    const viewOffer = await db.query(viewQuery);
    return viewOffer;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
}

async function viewTicket(customerId, busId, bookingId, startDate, endDate, limit) {
  const db = adminDb.makeDb(adminDb);

  try {
    let result;
    const ticketQuery = `select bus.name as busName, route.starting_point, route.destination,
        booking.date, ticket.id as ticketNumber, ticket.seats_id, ticket.passenger_name,
        ticket.passenger_email, ticket.passenger_phone, ticket.passenger_age
        from ticket inner join booking on ticket.booking_id = booking.id
        inner join bus on booking.bus_id = bus.id inner join route on 
        route.bus_id = bus.id inner join customer on customer.id = booking.customer_id
        where customer.id = ? and bus.id = ? and booking.id = ? limit ?`;
    const ticketView = await db.query(ticketQuery, [customerId, busId, bookingId, limit]);

    const dateView = `select bus.name as busName, route.starting_point, route.destination,
        booking.date, ticket.id as ticketNumber, ticket.seats_id, ticket.passenger_name,
        ticket.passenger_email, ticket.passenger_phone, ticket.passenger_age
        from ticket inner join booking on ticket.booking_id = booking.id
        inner join bus on booking.bus_id = bus.id inner join route on route.bus_id = bus.id
        inner join customer on customer.id = booking.customer_id
        where customer.id = ? and bus.id = ? and
        booking.date between ? and ? limit ?`;

    const ticketByDate = await db.query(
      dateView,
      [customerId, busId, startDate, endDate, limit],
    );

    if (!startDate || !endDate) {
      result = ticketView;
    }
    if (startDate !== undefined && endDate !== undefined) {
      result = ticketByDate;
    }
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
}

// async function addOffer() {
//   const db = adminDb.makeDb(adminDb);
//   try {

//     //if bokking.amount is 600 then 500;
//     // const offer = 'insert into offers()  ';
//     const offerDetails = `insert into offers
//         (bus_id,offer_name, offer_description, rate, validity_start, validity_ends) values`;
//   } catch (err) {

//   } finally {
//     await db.close();
//   }
// }

module.exports = {
  addBus,
  viewBus,
  viewBooking,
  viewOffers,
  viewTicket,
  // addOffer,
};
