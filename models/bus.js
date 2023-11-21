const busdb = require('../db_connection');

const db = busdb.makeDb(busdb);

async function addBus(name, busNumber, type, farePerKm, ratings, status) {
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
  } finally {
    await db.close();
  }
}

async function viewBus(startingPoint, destination, boardingTime) {
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
    } if (startingPoint != null && destination != null && boardingTime === undefined) {
      return allROute;
    } if (startingPoint != null && destination === undefined && boardingTime === undefined) {
      return startPointBus;
    }
    return allBus;
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
  seatStatus,
) {
  try {
    let messg;
    let bookingSeatId;
    const bookBus = `select id from seats where id not in (select ticket.seats_id
              from booking inner join bus on bus.id = booking.bus_id
               inner join ticket on booking.id = ticket.booking_id  inner join seats on 
              ticket.seats_id = seats.id where bus.id = ? and booking.date = ?)`;

    const checkBooking = await db.query(bookBus, [busId, date]);

    if (checkBooking) {
      const noOfSeat = noOfSeats;

      let insertionDone = false;

      for (let i = 0; i < seatsId.length; i += 1) {
        const elm = seatsId[i];
        const tempArry = checkBooking.filter((x) => x.id === elm.id);
        if (tempArry.length > 0 && !insertionDone) {
          const bookingQuery = 'INSERT INTO booking (customer_id, bus_id, date, no_of_seats, total_amount, status) VALUES (?, ?, ?, ?, ?, ?)';
          db.query(
            bookingQuery,
            [customerId, busId, date, noOfSeat, totalAmount, bookingStatus],
          );
          insertionDone = true;
        }
      }

      const bookingIdQuery = `select id from booking where customer_id = ?
                 and date = ? and bus_id = ?`;
      const bookingIdResult = await db.query(bookingIdQuery, [customerId, date, busId]);

      checkBooking.forEach(async (i) => {
        seatsId.forEach(async (seats) => {
          if (i.id === seats.id) {
            bookingIdResult.forEach(async (st) => {
              bookingSeatId = st.id;
            });
            const addTicket = 'insert into ticket (bus_id, booking_id, seats_id, status, passenger_name, passenger_email, passenger_phone,passenger_age) values (?, ?, ?, ?, ?, ?, ?, ?)';
            await db.query(
              addTicket,
              [busId, bookingSeatId, i.id, seatStatus, seats.passengerName,
                seats.passengerEmail, seats.passengerPhone, seats.passengerAge],
            );
          }
        });
      });
      if (bookingSeatId) {
        messg = { message: 'Seats Booked Successfully', errorType: 1 };
      } else {
        messg = { message: 'Selected seats are booked already', errorType: 0 };
      }
    } else {
      messg = 'No seats available';
    }

    return messg;
  } catch (err) {
    await db.close();
    return 'Error';
  }
}

async function viewBooking(date) {
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
  } finally {
    await db.close();
  }
}

async function viewOffers() {
  try {
    const viewQuery = `select * from offers where
             current_date() <= validity_ends and current_date()>= validaity_start `;
    const viewOffer = await db.query(viewQuery);
    return viewOffer;
  } finally {
    await db.close();
  }
}

async function viewTicket(customerId, busId, bookingId, startDate, endDate, limit) {
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
  } finally {
    await db.close();
  }
}

module.exports = {
  viewBus, addBus, booking, viewBooking, viewOffers, viewTicket,
};
