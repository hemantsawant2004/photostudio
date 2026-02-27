import { useEffect, useState } from "react";
import { BookingApi } from "../../../api/booking";
import type { Booking } from "../../../types/booking";

export function useMyBookings(token: string | null) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (currentToken: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await BookingApi.getMyBookings(currentToken);
      setBookings(data.bookings);
      setUnreadCount(data.unreadCount);
    } catch {
      setError("Unable to load your booking history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setBookings([]);
      setUnreadCount(0);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    void load(token);

    const interval = window.setInterval(() => {
      if (active) {
        void load(token);
      }
    }, 10000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [token]);

  const markSeen = async () => {
    if (!token) {
      return;
    }

    await BookingApi.markMyBookingsSeen(token);
    await load(token);
  };

  return {
    bookings,
    unreadCount,
    loading,
    error,
    markSeen,
  };
}
