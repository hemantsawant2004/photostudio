import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { BookingApi } from "../../../api/booking";
import { initialBookingForm } from "../data/content";
import type { Booking } from "../../../types/booking";
import type { BookingFormState } from "../types";
import type { AuthUser } from "../../../types/auth";
import type { BookingAvailabilityDay } from "../../../types/availability";

export function useBookingForm(user: AuthUser | null, token: string | null) {
  const [bookingForm, setBookingForm] = useState<BookingFormState>({
    ...initialBookingForm,
    name: user?.name ?? "",
    email: user?.email ?? "",
  });
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    setBookingForm((current) => ({
      ...current,
      name: user?.name ?? current.name,
      email: user?.email ?? current.email,
    }));
  }, [user?.email, user?.name]);

  const syncAvailableSelection = useCallback((availableDates: BookingAvailabilityDay[]) => {
    setBookingForm((current) => {
      const selectedDate =
        availableDates.find((item) => item.date === current.date) ?? availableDates[0];

      if (!selectedDate) {
        if (current.date === "" && current.time_slot === "") {
          return current;
        }

        return {
          ...current,
          date: "",
          time_slot: "",
        };
      }

      const selectedSlot = selectedDate.availableSlots.includes(current.time_slot)
        ? current.time_slot
        : (selectedDate.availableSlots[0] ?? "");

      if (current.date === selectedDate.date && current.time_slot === selectedSlot) {
        return current;
      }

      return {
        ...current,
        date: selectedDate.date,
        time_slot: selectedSlot,
      };
    });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingError(null);
    setBookingStatus(null);
    setIsSubmitting(true);

    const payload: Booking = {
      ...bookingForm,
      phone: bookingForm.phone || null,
      package: bookingForm.package || null,
      message: bookingForm.message || null,
    };

    try {
      await BookingApi.create(payload, token);
      setBookingStatus("Booking request sent. Check the backend bookings list for the new entry.");
      setBookingForm({
        ...initialBookingForm,
        name: user?.name ?? "",
        email: user?.email ?? "",
      });
    } catch {
      setBookingError("Booking submission failed. Confirm the backend is running and the database is reachable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    bookingForm,
    setBookingForm,
    bookingStatus,
    bookingError,
    isSubmitting,
    today,
    syncAvailableSelection,
    handleSubmit,
  };
}
