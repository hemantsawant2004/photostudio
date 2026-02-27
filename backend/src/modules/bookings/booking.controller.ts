import { Request, Response, NextFunction } from "express";
import { BookingService } from "./booking.service";
import type {
  CreateBookingInput,
  UpdateBookingStatusInput,
} from "./booking.schema";
import type { AuthenticatedRequest } from "../../middlewares/authenticate";

export const getBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customer =
      typeof req.query.customer === "string" ? req.query.customer : undefined;
    const bookings = await BookingService.getAll(customer);
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const getBookingStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await BookingService.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

export const getBookingAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const month = typeof req.query.month === "string" ? req.query.month : undefined;
    const availability = await BookingService.getAvailability(month);
    res.json({ success: true, data: availability });
  } catch (err) {
    next(err);
  }
};

export const getAdminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customer =
      typeof req.query.customer === "string" ? req.query.customer : undefined;
    const dashboard = await BookingService.getAdminDashboard(customer);
    res.json({ success: true, data: dashboard });
  } catch (err) {
    next(err);
  }
};

export const createBooking = async (
  req: Request<{}, {}, CreateBookingInput>,
  res: Response,
  next: NextFunction,
) => {
    try {
      const authenticatedRequest = req as AuthenticatedRequest;
      const booking = await BookingService.create(req.body, authenticatedRequest.user?.id);
      res.status(201).json({ success: true, data: booking });
    } catch (err) {
      next(err);
    }
};

export const updateBookingStatus = async (
  req: Request<{ id: string }, {}, UpdateBookingStatusInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const booking = await BookingService.updateStatus(Number(req.params.id), req.body);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    const result = await BookingService.getUserBookings(authenticatedRequest.user.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const markMyBookingsSeen = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authenticatedRequest = req as AuthenticatedRequest;
    await BookingService.markUserBookingsSeen(authenticatedRequest.user.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
