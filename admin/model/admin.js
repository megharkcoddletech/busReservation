const adminDb = require('../../db_connection');

async function addBus(name, busNumber, type, farePerKm, ratings, status) {
  const db = adminDb.makeDb();
  try {
    let result;
    if (busNumber !== null) {
      const bus = 'select bus_number from bus where bus_number = ?';
      const checkBus = await db.query(bus, [busNumber]);
      if (checkBus.length > 0) {
        result = checkBus;
      } else {
        const addBusQuery = 'insert into bus (name, bus_number, type, fare_per_km, ratings, status) values(?,?,?,?,?,?)';
        result = await db.query(
          addBusQuery,
          [name, busNumber, type, farePerKm, ratings, status],
        );
      }
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
  const db = adminDb.makeDb();

  try {
    let result;
    const getAllBus = `select bus.id, bus.name, bus.bus_number, bus.type, bus.fare_per_km, bus.ratings,
            bus.status,route.starting_point, route.destination, route.boarding_time, route.deboarding_time,
            booking_amenities.m_ticket, booking_amenities.cctv,
            booking_amenities.reading_light, booking_amenities.blanket,booking_amenities.charging_point,
            booking_amenities.emergency_contacts
            from bus inner join route on bus.id = route.bus_id inner join booking_amenities on
            booking_amenities.bus_id = bus.id`;

    if (startingPoint != null && destination != null && boardingTime != null) {
      const getBusByTime = `${getAllBus} WHERE route.starting_point =? AND route.destination = ? and route.boarding_time = ?`;
      result = await db.query(getBusByTime, [startingPoint, destination, boardingTime]);
    } else if (startingPoint != null && destination != null && boardingTime === undefined) {
      const getBusByRoute = `${getAllBus} WHERE route.starting_point = ? AND route.destination = ? limit 10`;
      result = await db.query(getBusByRoute, [startingPoint, destination]);
    } else if (startingPoint != null && destination === undefined && boardingTime === undefined) {
      const startPointOnly = `${getAllBus} WHERE route.starting_point = ? limit 10`;
      result = await db.query(startPointOnly, [startingPoint]);
    } else {
      result = await db.query(`${getAllBus} limit 10`);
    }
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
}

async function viewBooking(date) {
  const db = adminDb.makeDb();

  try {
    let result;
    const booking = `select customer.name, bus.name as busname, booking.date,
              booking.no_of_seats as noOfSeats, booking.total_amount as totalAmount, booking.status,
              route.starting_point as startingPoint, route.destination, route.boarding_time as boardingTime, route.deboarding_time as deboardingTime from booking
              inner join customer on customer.id = booking.customer_id inner join bus on bus.id = booking.bus_id
              inner join route on bus.id = route.bus_id`;
    if (date != null) {
      const filterByDate = `${booking} where booking.date = ?`;
      result = await db.query(filterByDate, [date]);
    } else {
      result = await db.query(`${booking} where booking.date = current_date() `);
    }
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
}

async function viewOffers() {
  const db = adminDb.makeDb();

  try {
    const viewQuery = `select * from offers where
               current_date() <= validity_ends and current_date()>= validaity_start`;
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
  const db = adminDb.makeDb();
  try {
    let result;
    const query = `select bus.name as busName, route.starting_point, route.destination,
                booking.date, ticket.id as ticketNumber, ticket.seats_id, ticket.passenger_name,
                ticket.passenger_email, ticket.passenger_phone, ticket.passenger_age
                from ticket inner join booking on ticket.booking_id = booking.id
                inner join bus on booking.bus_id = bus.id inner join route on 
                route.bus_id = bus.id inner join customer on customer.id = booking.customer_id`;
    if (!startDate || !endDate) {
      const ticketQuery = `${query} where customer.id = ? and bus.id = ? and booking.id = ? limit ?`;
      result = await db.query(ticketQuery, [customerId, busId, bookingId, limit]);
    }
    if (startDate !== undefined && endDate !== undefined) {
      const dateView = `${query} where customer.id = ? and bus.id = ? and
              booking.date between ? and ? limit ?`;
      result = await db.query(
        dateView,
        [customerId, busId, startDate, endDate, limit],
      );
    }
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
}

async function addOffer(busId, offerName, offerDescription, rate, StartDate, endDate, seatType) {
  const db = adminDb.makeDb();
  let result;
  try {
    if (busId !== null) {
      const singleBus = `insert into offers
            (bus_id,offer_name, offer_description, rate, validaity_start, validity_ends, conditions) values(?, ?, ?, ?, ?, ? ,?) `;

      result = await db.query(
        singleBus,
        [busId, offerName, offerDescription, rate, StartDate, endDate, seatType],
      );
    } else {
      const allBus = `insert into offers
                    (offer_name, offer_description, rate, validaity_start, validity_ends, conditions) values(?, ?, ?, ?, ? ,?) `;

      result = await db.query(
        allBus,
        [offerName, offerDescription, rate, StartDate, endDate, seatType],
      );
    }
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
}

async function viewReview(busId) {
  const db = adminDb.makeDb();
  try {
    let result;
    const allReview = `select bus.name, customer.name as customer, bus_review.reiew as review,
    bus_review.suggestions, DATE_FORMAT(bus_review.created, '%Y-%m-%d') as date
    from bus_review inner join bus on bus_review.bus_id = bus.id
    inner join customer on bus_review.cust_id = customer.id`;
    if (busId !== undefined) {
      const getReview = `${allReview} where bus_id = ?`;
      result = await db.query(getReview, busId);
    } else {
      result = await db.query(allReview);
    }
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
}

module.exports = {
  addBus,
  viewBus,
  viewBooking,
  viewOffers,
  viewTicket,
  addOffer,
  viewReview,
};
