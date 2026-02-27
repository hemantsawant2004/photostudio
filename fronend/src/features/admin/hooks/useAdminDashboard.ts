import { useEffect, useState } from "react";
import { BookingApi } from "../../../api/booking";
import type { AdminDashboardData, BookingStats } from "../../../types/admin";
import type { AuthUser } from "../../../types/auth";

const emptyStats: BookingStats = {
  total: 0,
  pending: 0,
  confirmed: 0,
  cancelled: 0,
  today: 0,
};

export function useAdminDashboard(user: AuthUser | null, token: string | null) {
  const [data, setData] = useState<AdminDashboardData>({
    bookings: [],
    stats: emptyStats,
    activity: [],
    generated_at: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerFilter, setCustomerFilter] = useState("");

  const loadDashboard = async (currentToken: string, currentFilter: string) => {
    setLoading(true);
    setError(null);

    try {
      const dashboard = await BookingApi.getAdminDashboard(
        currentToken,
        currentFilter || undefined,
      );
      setData(dashboard);
    } catch {
      setError("Unable to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "ADMIN" || !token) {
      setData({
        bookings: [],
        stats: emptyStats,
        activity: [],
        generated_at: "",
      });
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    void loadDashboard(token, customerFilter);

    const interval = window.setInterval(() => {
      if (active) {
        void loadDashboard(token, customerFilter);
      }
    }, 10000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [customerFilter, token, user]);

  return {
    ...data,
    loading,
    error,
    customerFilter,
    setCustomerFilter,
    refresh: token ? () => loadDashboard(token, customerFilter) : async () => {},
  };
}
