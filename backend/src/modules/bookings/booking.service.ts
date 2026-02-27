import { Op } from "sequelize";
import { Booking } from "../../models/booking";
import type {
  CreateBookingInput,
  UpdateBookingStatusInput,
} from "./booking.schema";

export const BOOKING_TIME_SLOTS = [
  "10:00 AM",
  "12:30 PM",
  "03:00 PM",
  "05:30 PM",
];

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getMonthRange(month?: string) {
  const base = month ? new Date(`${month}-01T00:00:00`) : new Date();
  const year = base.getFullYear();
  const monthIndex = base.getMonth();
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

function getDatesInRange(start: string, end: string) {
  const dates: string[] = [];
  const current = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);

  while (current <= last) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export const BookingService = {
  async getAll(customer?: string) {
    const where = customer
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${customer}%` } },
            { email: { [Op.like]: `%${customer}%` } },
          ],
        }
      : undefined;

    const bookings = await Booking.findAll({
      where,
      order: [["created_at", "DESC"]],
    });
    return bookings;
  },

  async create(data: CreateBookingInput, userId?: number) {
    const existingBooking = await Booking.findOne({
      where: {
        date: data.date,
        time_slot: data.time_slot,
        status: {
          [Op.ne]: "CANCELLED",
        },
      },
    });

    if (existingBooking) {
      const error = new Error("Selected slot is unavailable");
      (error as Error & { status?: number }).status = 409;
      throw error;
    }

    const booking = await Booking.create({
      user_id: userId ?? null,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      date: data.date,
      time_slot: data.time_slot,
      package: data.package ?? null,
      message: data.message ?? null,
      status: "PENDING",
      status_updated_at: null,
      status_seen_at: null,
    });

    return booking;
  },

  async updateStatus(id: number, data: UpdateBookingStatusInput) {
    const booking = await Booking.findByPk(id);

    if (!booking) {
      const error = new Error("Booking not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    booking.status = data.status;
    booking.status_updated_at = new Date();
    booking.status_seen_at = null;
    await booking.save();
    return booking;
  },

  async getUserBookings(userId: number) {
    const bookings = await Booking.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    const unreadCount = bookings.filter(
      (booking) =>
        booking.status !== "PENDING" &&
        booking.status_updated_at &&
        !booking.status_seen_at,
    ).length;

    return {
      bookings,
      unreadCount,
    };
  },

  async markUserBookingsSeen(userId: number) {
    const now = new Date();
    await Booking.update(
      { status_seen_at: now },
      {
        where: {
          user_id: userId,
          status_seen_at: null,
          status: {
            [Op.ne]: "PENDING",
          },
        },
      },
    );
  },

  async getStats() {
    const bookings = await Booking.findAll();

    return bookings.reduce(
      (summary, booking) => {
        summary.total += 1;
        summary[booking.status.toLowerCase() as "pending" | "confirmed" | "cancelled"] += 1;

        if (booking.date === getTodayDate()) {
          summary.today += 1;
        }

        return summary;
      },
      {
        total: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        today: 0,
      },
    );
  },

  async getAvailability(month?: string) {
    const { start, end } = getMonthRange(month);
    const bookings = await Booking.findAll({
      where: {
        date: {
          [Op.between]: [start, end],
        },
        status: {
          [Op.ne]: "CANCELLED",
        },
      },
      order: [
        ["date", "ASC"],
        ["time_slot", "ASC"],
      ],
    });

    const dateMap = new Map<
      string,
      {
        bookedSlots: string[];
        bookingsCount: number;
      }
    >();

    for (const booking of bookings) {
      const current = dateMap.get(booking.date) ?? {
        bookedSlots: [],
        bookingsCount: 0,
      };
      current.bookedSlots.push(booking.time_slot);
      current.bookingsCount += 1;
      dateMap.set(booking.date, current);
    }

    const dates = getDatesInRange(start, end).map((date) => {
      const value = dateMap.get(date) ?? {
        bookedSlots: [],
        bookingsCount: 0,
      };
      const availableSlots = BOOKING_TIME_SLOTS.filter(
        (slot) => !value.bookedSlots.includes(slot),
      );

      return {
        date,
        bookedSlots: value.bookedSlots,
        availableSlots,
        bookingsCount: value.bookingsCount,
        isFullyBooked: availableSlots.length === 0,
      };
    });

    return {
      month: month ?? getTodayDate().slice(0, 7),
      slots: BOOKING_TIME_SLOTS,
      dates,
    };
  },

  async getAdminDashboard(customer?: string) {
    const bookings = await this.getAll(customer);
    const stats = await this.getStats();

    const recentBookings = bookings.slice(0, 10);
    const activity = recentBookings.map((booking) => ({
      id: booking.id,
      type: "BOOKING_CREATED" as const,
      title: `${booking.name} booked ${booking.package ?? "a custom session"}`,
      detail: `${booking.date} at ${booking.time_slot}`,
      customer: booking.email,
      status: booking.status,
      created_at: booking.created_at,
    }));

    return {
      stats,
      bookings: recentBookings,
      activity,
      generated_at: new Date().toISOString(),
    };
  },
};
