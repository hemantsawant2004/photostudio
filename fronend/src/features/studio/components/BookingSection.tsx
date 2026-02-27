import { useEffect, useMemo, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { BookingFormState } from "../types";
import { usePackages } from "../hooks/usePackages";
import { useBookingAvailability } from "../../bookings/hooks/useBookingAvailability";
import type { BookingAvailabilityDay } from "../../../types/availability";

type BookingSectionProps = {
  bookingForm: BookingFormState;
  setBookingForm: Dispatch<SetStateAction<BookingFormState>>;
  bookingStatus: string | null;
  bookingError: string | null;
  isSubmitting: boolean;
  today: string;
  syncAvailableSelection: (availableDates: BookingAvailabilityDay[]) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function BookingSection({
  bookingForm,
  setBookingForm,
  bookingStatus,
  bookingError,
  isSubmitting,
  today,
  syncAvailableSelection,
  handleSubmit,
}: BookingSectionProps) {
  const { packages } = usePackages();
  const { month, setMonth, monthOptions, dates, loading, error } = useBookingAvailability();

  const availableDates = useMemo(
    () => dates.filter((item) => !item.isFullyBooked && item.date >= today),
    [dates, today],
  );
  const selectedDate = availableDates.find((item) => item.date === bookingForm.date);
  const availableSlots = selectedDate?.availableSlots ?? [];

  useEffect(() => {
    syncAvailableSelection(availableDates);
  }, [syncAvailableSelection, availableDates]);

  return (
    <section
      className="mx-auto grid w-full max-w-7xl gap-6 px-5 pt-20 pb-20 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:px-8"
      id="booking"
    >
      <div className="self-start pt-2">
        <p className="mb-3 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-[#976841]">
          Bookings
        </p>
        <h2 className="m-0 max-w-[12ch] text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.04em] text-[#1d140f]">
          Book your session
        </h2>
        <p className="mt-4 m-0 leading-7 text-[#69513d]">
          Only available dates and time slots are shown below. Fully booked dates are hidden
          from customers automatically.
        </p>
      </div>

      <form
        className="grid gap-4 rounded-[24px] bg-[#fffaf4] p-6 shadow-[0_18px_60px_rgba(54,33,17,0.08)] md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <label className="grid gap-2 font-semibold text-[#1d140f]">
          Name
          <input
            className="w-full rounded-2xl border border-[#e7d8ca] bg-white px-4 py-3 text-[#241811] outline-none"
            required
            value={bookingForm.name}
            onChange={(event) =>
              setBookingForm((current) => ({ ...current, name: event.target.value }))
            }
          />
        </label>
        <label className="grid gap-2 font-semibold text-[#1d140f]">
          Email
          <input
            className="w-full rounded-2xl border border-[#e7d8ca] bg-white px-4 py-3 text-[#241811] outline-none"
            required
            type="email"
            value={bookingForm.email}
            onChange={(event) =>
              setBookingForm((current) => ({ ...current, email: event.target.value }))
            }
          />
        </label>
        <label className="grid gap-2 font-semibold text-[#1d140f]">
          Phone
          <input
            className="w-full rounded-2xl border border-[#e7d8ca] bg-white px-4 py-3 text-[#241811] outline-none"
            value={bookingForm.phone}
            onChange={(event) =>
              setBookingForm((current) => ({ ...current, phone: event.target.value }))
            }
          />
        </label>
        <label className="grid gap-2 font-semibold text-[#1d140f]">
          Month
          <select
            className="w-full rounded-2xl border border-[#e7d8ca] bg-white px-4 py-3 text-[#241811] outline-none"
            onChange={(event) => setMonth(event.target.value)}
            value={month}
          >
            {monthOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 font-semibold text-[#1d140f]">
          Available date
          <select
            className="w-full rounded-2xl border border-[#e7d8ca] bg-white px-4 py-3 text-[#241811] outline-none"
            onChange={(event) =>
              setBookingForm((current) => ({ ...current, date: event.target.value }))
            }
            value={bookingForm.date}
          >
            {availableDates.map((item) => (
              <option key={item.date} value={item.date}>
                {item.date}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 font-semibold text-[#1d140f]">
          Time slot
          <select
            className="w-full rounded-2xl border border-[#e7d8ca] bg-white px-4 py-3 text-[#241811] outline-none"
            onChange={(event) =>
              setBookingForm((current) => ({ ...current, time_slot: event.target.value }))
            }
            value={bookingForm.time_slot}
          >
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 font-semibold text-[#1d140f]">
          Package
          <select
            className="w-full rounded-2xl border border-[#e7d8ca] bg-white px-4 py-3 text-[#241811] outline-none"
            value={bookingForm.package}
            onChange={(event) =>
              setBookingForm((current) => ({ ...current, package: event.target.value }))
            }
          >
            {packages.map((item) => (
              <option key={item.id ?? item.name}>{item.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 font-semibold text-[#1d140f] md:col-span-2">
          Notes
          <textarea
            className="w-full rounded-2xl border border-[#e7d8ca] bg-white px-4 py-3 text-[#241811] outline-none"
            rows={5}
            value={bookingForm.message}
            onChange={(event) =>
              setBookingForm((current) => ({ ...current, message: event.target.value }))
            }
            placeholder="Tell the studio what you're planning."
          />
        </label>
        {loading ? <p className="m-0 text-[#69513d] md:col-span-2">Loading availability...</p> : null}
        {error ? <p className="m-0 text-[#9d2f2f] md:col-span-2">{error}</p> : null}
        {!loading && availableDates.length === 0 ? (
          <p className="m-0 text-[#9d2f2f] md:col-span-2">
            No available dates for this month. Please choose another month.
          </p>
        ) : null}
        <button
          className="rounded-full bg-[#f4b16c] px-6 py-4 font-bold text-[#23170f] transition hover:-translate-y-0.5 disabled:cursor-progress disabled:opacity-70 md:col-span-2"
          disabled={isSubmitting || availableDates.length === 0 || availableSlots.length === 0}
          type="submit"
        >
          {isSubmitting ? "Submitting..." : "Send booking request"}
        </button>
        {bookingStatus ? (
          <p className="m-0 text-[0.95rem] text-[#2f6b43] md:col-span-2">{bookingStatus}</p>
        ) : null}
        {bookingError ? (
          <p className="m-0 text-[0.95rem] text-[#9d2f2f] md:col-span-2">{bookingError}</p>
        ) : null}
      </form>
    </section>
  );
}
