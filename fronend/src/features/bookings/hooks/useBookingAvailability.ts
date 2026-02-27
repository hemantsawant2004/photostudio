import { useEffect, useMemo, useState } from "react";
import { BookingApi } from "../../../api/booking";
import type { BookingAvailabilityDay } from "../../../types/availability";

function formatMonth(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthOptions() {
  const now = new Date();
  return Array.from({ length: 3 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() + index, 1);
    return formatMonth(date);
  });
}

export function useBookingAvailability(selectedMonth?: string) {
  const monthOptions = useMemo(() => getMonthOptions(), []);
  const [month, setMonth] = useState<string>(selectedMonth ?? monthOptions[0]);
  const [dates, setDates] = useState<BookingAvailabilityDay[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadAvailability = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await BookingApi.getAvailability(month);
        if (!active) {
          return;
        }
        setDates(data.dates);
        setSlots(data.slots);
      } catch {
        if (!active) {
          return;
        }
        setError("Unable to load booking availability.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadAvailability();

    return () => {
      active = false;
    };
  }, [month]);

  return {
    month,
    setMonth,
    monthOptions,
    dates,
    slots,
    loading,
    error,
  };
}
