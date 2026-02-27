import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getAdminDashboard,
  getBookingAvailability,
  getBookings,
  getBookingStats,
  markMyBookingsSeen,
  updateBookingStatus,
} from "./booking.controller";
import { validate } from "../../middlewares/validate";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "./booking.schema";
import {
  authenticate,
  authenticateOptional,
  requireAdmin,
} from "../../middlewares/authenticate";

export const bookingRouter = Router();

bookingRouter.get("/", authenticate, requireAdmin, getBookings);
bookingRouter.get("/availability", getBookingAvailability);
bookingRouter.get("/me", authenticate, getMyBookings);
bookingRouter.post("/me/seen", authenticate, markMyBookingsSeen);
bookingRouter.get("/stats", authenticate, requireAdmin, getBookingStats);
bookingRouter.get("/admin/dashboard", authenticate, requireAdmin, getAdminDashboard);
bookingRouter.patch(
  "/:id/status",
  authenticate,
  requireAdmin,
  validate(updateBookingStatusSchema),
  updateBookingStatus,
);
bookingRouter.post("/", authenticateOptional, validate(createBookingSchema), createBooking);
