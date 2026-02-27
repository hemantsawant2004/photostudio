import type { Booking } from "./booking";

export type MyBookingsResponse = {
  bookings: Booking[];
  unreadCount: number;
};
