import { api } from "./client";
import type { Booking } from "../types/booking";
import type { AdminDashboardData, BookingStats } from "../types/admin";
import type { BookingStatus } from "../types/booking";
import type { MyBookingsResponse } from "../types/account";
import type { BookingAvailability } from "../types/availability";

export const BookingApi = {
  async getAll(token: string): Promise<Booking[]> {
    const res = await api.get("/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  },

  async create(payload: Booking, token?: string | null): Promise<Booking> {
    const res = await api.post("/bookings", payload, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
    return res.data.data;
  },

  async getStats(token: string): Promise<BookingStats> {
    const res = await api.get("/bookings/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  },

  async getAdminDashboard(token: string, customer?: string): Promise<AdminDashboardData> {
    const res = await api.get("/bookings/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: customer ? { customer } : undefined,
    });
    return res.data.data;
  },

  async updateStatus(id: number, status: BookingStatus, token: string): Promise<Booking> {
    const res = await api.patch(
      `/bookings/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data.data;
  },

  async getMyBookings(token: string): Promise<MyBookingsResponse> {
    const res = await api.get("/bookings/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  },

  async markMyBookingsSeen(token: string): Promise<void> {
    await api.post(
      "/bookings/me/seen",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },

  async getAvailability(month: string): Promise<BookingAvailability> {
    const res = await api.get("/bookings/availability", {
      params: { month },
    });
    return res.data.data;
  },
};
