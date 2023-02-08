import { notFoundError } from "@/errors";
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
  await verifyingVacancy(roomId);

  const booking = await bookingRepository.createBooking(roomId, userId);
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
