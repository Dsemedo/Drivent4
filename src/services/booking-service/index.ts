import { notFoundError, unauthorizedError } from "@/errors";
import { forbiddenError } from "@/errors/forbidden-error";
import bookingRepository from "@/repositories/booking-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function listBooking(userId: number) {
  const booking = await bookingRepository.returnBooking(userId);

  if(!booking) {
    throw notFoundError();
  }

  return booking;
}

async function insertBooking(roomId: number, userId: number) {
  if(!roomId || !userId) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByUser(userId);
  const notIsPaid = ticket.status === "RESERVED";
  const isRemote = ticket.TicketType.isRemote;
  const IncludesHotel = ticket.TicketType.includesHotel;
  
  const booking = await bookingRepository.createBooking(roomId, userId);

  const room = await bookingRepository.findRoomById(roomId);
  const bookings = await bookingRepository.findBookings(roomId);

  if(bookings.length >= room.capacity) {
    throw forbiddenError();
  }

  if(!IncludesHotel || notIsPaid || isRemote) {
    throw forbiddenError();
  }

  return booking;
}

async function updateBooking(roomId: number, userId: number, bookingId: number) {
  const booking = await bookingRepository.returnBooking(userId);
  if(!booking) {
    throw forbiddenError();
  }
  
  const room = await bookingRepository.findRoomById(roomId);
  if(!room) {
    throw notFoundError();
  }

  const bookingUser = bookingId === booking.id;
  if(!bookingUser) {
    throw forbiddenError();
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
