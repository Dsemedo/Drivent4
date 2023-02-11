import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";

import bookingService from "@/services/booking-service";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try{
    const booking = await bookingService.listBooking(userId);

    return res.status(httpStatus.OK).send(booking);
  }catch(err) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
} 

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try{
    const booking = await bookingService.insertBooking(roomId, userId);

    return res.status(httpStatus.OK).send(booking);
  }catch(err) {
    if(err.name === "Forbidden") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if(err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;
  try{
    await bookingService.updateBooking(roomId, userId, Number(bookingId));

    return res.sendStatus(httpStatus.OK);
  }catch(err) {
    if(err.name === "Forbidden") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if(err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}
