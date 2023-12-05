const busdb = require('../../db_connection');

async function viewBus(startingPoint, destination, boardingTime) {
  const db = busdb.makeDb(busdb);

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

async function viewSeats(
  date,
) {
  const db = busdb.makeDb(busdb);
  try {
    let messg;
    let offerCost = 0;
    const bookBus = `select seats.bus_id as busId,seats.id, (seats.rate + route.distance * bus.fare_per_km) AS seatCost,seat_type as seatType
                from seats inner join bus on seats.bus_id = bus.id
                inner join route on route.bus_id = bus.id
                where seats.id not in (select ticket.seats_id from booking
                inner join bus on bus.id = booking.bus_id
                inner join ticket on booking.id = ticket.booking_id
                inner join seats on ticket.seats_id = seats.id
                where booking.date = ? and ticket.status != "cancelled"
                )`;
    const checkBooking = await db.query(bookBus, [date]);
    if (checkBooking) {
      const key = 'offerPrice';

      const viewOfferbyDate = `select bus_id as busId, rate, conditions as seatType from offers where
            current_date() <= validity_ends and current_date()>= validaity_start`;
      const offer = await db.query(viewOfferbyDate);
      if (offer) {
        for (let c = 0; c < offer.length; c += 1) {
          for (let off = 0; off < checkBooking.length; off += 1) {
            if (offer[c].busId === null) {
              const offerRate = (offer[c].rate) / 100;

              if (offer[c].seatType === checkBooking[off].seatType) {
                offerCost = (parseInt(checkBooking[off].seatCost, 10)
                           - parseInt(checkBooking[off].seatCost, 10) * offerRate);
                checkBooking[off][key] = offerCost;
              } else if (offer[c].seatType === 'all') {
                offerCost = (parseInt(checkBooking[off].seatCost, 10)
                           - parseInt(checkBooking[off].seatCost, 10) * offerRate);
                checkBooking[off][key] = offerCost;
              } else {
                checkBooking[off][key] = offerCost;
              }
            } else if (offer[c].busId === checkBooking[off].busId) {
              const offerRate = (offer[c].rate) / 100;

              if (checkBooking[off].seatType === offer[c].seatType) {
                offerCost = (parseInt(checkBooking[off].seatCost, 10)
                              - parseInt(checkBooking[off].seatCost, 10) * offerRate);
                checkBooking[off][key] = offerCost;
              } else if (offer[c].seatType === 'all') {
                offerCost = (parseInt(checkBooking[off].seatCost, 10)
                - parseInt(checkBooking[off].seatCost, 10) * offerRate);
                checkBooking[off][key] = offerCost;
              } else {
                offerCost = 0;
                checkBooking[off][key] = offerCost;
              }
            }
          }
        }
      } else {
        for (let i = 0; i < checkBooking.length; i += 1) {
          checkBooking[i][key] = offerCost;
        }
      }
      if (checkBooking) {
        messg = {
          message: checkBooking,
          errorType: 1,
        };
      }
    } else {
      messg = 'No seats available';
    }

    return messg;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
}
async function booking(
  customerId,
  busId,
  date,
  noOfSeats,
  totalAmount,
  bookingStatus,
  seatsId,
) {
  const db = busdb.makeDb(busdb);

  try {
    let messg;
    let bookingId;
    const bookBus = `select seats.id, (seats.rate + route.distance * bus.fare_per_km) AS seatCost
                from seats inner join bus on seats.bus_id = bus.id
                inner join route on route.bus_id = bus.id
                where seats.id not in (select ticket.seats_id from booking
                inner join bus on bus.id = booking.bus_id
                inner join ticket on booking.id = ticket.booking_id
                inner join seats on ticket.seats_id = seats.id
                where bus.id = ? and booking.date = ? and ticket.status != "cancelled"
                )`;

    const checkBooking = await db.query(bookBus, [busId, date]);
    if (checkBooking) {
      const noOfSeat = noOfSeats;
      let insertionDone = false;
      let tAmount = 0;
      let oAmount = 0;
      for (let i = 0; i < seatsId.length; i += 1) {
        const seats = seatsId[i];
        const tempArry = checkBooking.filter((x) => x.id === seats.id);
        if (tempArry.length > 0) {
          tAmount = tempArry[0].seatCost;
          console.log('okkkkk', tAmount);
          if (!insertionDone) {
            // console.log('ok', tAmount);
            const bookingQuery = 'insert into booking (customer_id, bus_id, date, no_of_seats, total_amount, status) values (?, ?, ?, ?, ?, ?)';
            db.query(
              bookingQuery,
              [customerId, busId, date, noOfSeat, totalAmount, bookingStatus],
            );
            insertionDone = true;
            oAmount += tAmount;
            console.log('omnut', oAmount);
            console.log('true', tAmount);
          }
        }
      }
      const bookingIdQuery = `select id from booking where customer_id = ?
                 and date = ? and bus_id = ?`;
      const bookingIdResult = await db.query(bookingIdQuery, [customerId, date, busId]);
      let total = 0;
      checkBooking.forEach(async (i) => {
        console.log('ii', i);
        seatsId.forEach(async (seats) => {
          if (i.id === seats.id) {
            total += (i.seatCost);
            console.log(total);
            bookingIdResult.forEach(async (st) => {
              bookingId = st.id;
            });

            const addTicket = 'insert into ticket (bus_id, booking_id, seats_id, status, passenger_name, passenger_email, passenger_phone,passenger_age) values (?, ?, ?, ?, ?, ?, ?, ?)';
            await db.query(
              addTicket,
              [busId, bookingId, i.id, seats.status, seats.passengerName,
                seats.passengerEmail, seats.passengerPhone, seats.passengerAge],
            );
          }
        });
      });
      const addTotal = `update booking set total_amount = ${total} where id = ${bookingId}`;
      await db.query(addTotal);
      const offerRate = 10 / 100;
      const sArray = [];
      for (let off = 0; off < checkBooking.length; off += 1) {
        sArray.push(checkBooking[off].seatCost);
      }
      const lastAr = [];
      for (let off = 0; off < sArray.length; off += 1) {
        const a = sArray[off] - (sArray[off] * offerRate);
        lastAr.push(a);
      }
      if (bookingId) {
        messg = { message: 'Seats Booked Successfully', errorType: 1 };
      } else {
        messg = { message: 'Selected seats are booked already', errorType: 0 };
      }
    } else {
      messg = 'No seats available';
    }

    return messg;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
}

async function viewBooking(date) {
  const db = busdb.makeDb(busdb);

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
  const db = busdb.makeDb(busdb);

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
  const db = busdb.makeDb(busdb);

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
        where customer.id = ? and bus.id = ? and booking.id = ? and
        booking.date between ? and ? limit ?`;

    const ticketByDate = await db.query(
      dateView,
      [customerId, busId, bookingId, startDate, endDate, limit],
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

async function cancelBookings(bookingId, seatsToCancel) {
  const db = busdb.makeDb(busdb.makeDb);
  try {
    const selectTicket = 'select seats_id from ticket where booking_id = ? and status = "booked"';
    const bookedSeats = await db.query(selectTicket, [bookingId]);
    if (bookedSeats.length > 0) {
      if (seatsToCancel.length > 0) {
        for (let i = 0; i < seatsToCancel.length; i += 1) {
          for (let j = 0; j < bookedSeats.length; j += 1) {
            if (seatsToCancel[i] === bookedSeats[j].seats_id) {
              const updateTicket = 'update ticket set status = "cancelled" where booking_id = ? and seats_id in (?)';
              db.query(updateTicket, [bookingId, seatsToCancel[i]]);
              if (i === seatsToCancel.length) {
                const cancelBookingQuery = 'update booking set status = "cancelled" where id = ?';
                db.query(cancelBookingQuery, [bookingId]);
              }
            }
          }
        }
      }
    } else {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  } finally {
    await db.close();
  }
}

module.exports = {
  viewBus,
  booking,
  viewBooking,
  viewOffers,
  viewTicket,
  cancelBookings,
  viewSeats,
};
