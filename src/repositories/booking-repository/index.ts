import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function returnBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId
    }, 
    select: {
      id: true,
      Room: true,
    }
  });
}

export type CreateBooking = Omit<Booking, "id" | "userId" | "createdAt" | "updatedAt">;

async function createBooking(roomId: number, userId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      roomId,
      userId
    }
  });
}

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      roomId: roomId,
    }
  });
}

async function findRoomById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId
    }
  });
}

async function findBookings(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId
    }
  });
}

const bookingRepository = {
  returnBooking,
  createBooking,
  findRoomById,
  findBookings,
  updateBooking
};

export default bookingRepository;
