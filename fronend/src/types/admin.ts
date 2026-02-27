import type { Booking } from "./booking";

export type BookingStats = {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  today: number;
};

export type AdminActivityItem = {
  id?: number;
  type: "BOOKING_CREATED";
  title: string;
  detail: string;
  customer?: string;
  status?: string;
  created_at?: string;
};

export type AdminDashboardData = {
  bookings: Booking[];
  stats: BookingStats;
  activity: AdminActivityItem[];
  generated_at: string;
};
