import { notFoundError, unauthorizedError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function listBooking(userId: number) {
  const booking = await bookingRepository.returnBooking(userId);

  if(!booking) {
    throw notFoundError();
  }

  return { booking: booking.id, Room: booking.Room };
}

async function insertBooking(roomId: number, userId: number) {
  const ticket = await ticketRepository.findTicketByUser(userId);
  const statusTicket = ticket.status === "RESERVED";
  const isRemote = ticket.TicketType.isRemote;
  const includesHotel = ticket.TicketType.includesHotel;

  if(statusTicket || isRemote || !includesHotel) {
    throw notFoundError();
  }
  
  await verifyingVacancy(roomId);

  const booking = await bookingRepository.createBooking(roomId, userId);

  return booking;
}

async function verifyingVacancy(roomId: number) {
  const room = await bookingRepository.findRoomById(roomId);
  const bookings = await bookingRepository.findBookings(roomId);

  if(!room) {
    throw notFoundError();
  }
  
  if(bookings.length >= room.capacity) {
    throw notFoundError();
  }
}

async function updateBooking(roomId: number, userId: number, bookingId: number) {
  const booking = await bookingRepository.returnBooking(userId);
  if(!booking) {
    throw notFoundError();
  }
  
  const room = await bookingRepository.findRoomById(roomId);
  if(!room) {
    throw notFoundError();
  }

  const bookingUser = bookingId === booking.id;
  if(!bookingUser) {
    throw unauthorizedError();
  }

  const newBooking = await bookingRepository.updateBooking(bookingId, roomId);

  return newBooking;
}

const bookingService = {
  listBooking,
  insertBooking,
  updateBooking,
};

export default bookingService;
