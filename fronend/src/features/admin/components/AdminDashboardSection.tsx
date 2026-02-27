import { useState } from "react";
import { BookingApi } from "../../../api/booking";
import type { Booking } from "../../../types/booking";
import type { AdminActivityItem, BookingStats } from "../../../types/admin";
import type { BookingStatus } from "../../../types/booking";
import type { StudioPackage } from "../../../types/package";
import { useBookingAvailability } from "../../bookings/hooks/useBookingAvailability";

type AdminDashboardSectionProps = {
  bookings: Booking[];
  stats: BookingStats;
  activity: AdminActivityItem[];
  generatedAt: string;
  loading: boolean;
  error: string | null;
  token: string;
  customerFilter: string;
  onCustomerFilterChange: (value: string) => void;
  onRefresh: () => Promise<void>;
  packages: StudioPackage[];
  packagesLoading: boolean;
  packagesError: string | null;
  packageForm: {
    name: string;
    price: string;
    description: string;
    featuresText: string;
    enquiry_message: string;
  };
  onPackageFormChange: (
    field: "name" | "price" | "description" | "featuresText" | "enquiry_message",
    value: string,
  ) => void;
  onPackageSubmit: () => Promise<void>;
  packageSaving: boolean;
};

const statCards = [
  { key: "total", label: "Total bookings", detail: "All requests in the system." },
  { key: "pending", label: "Pending", detail: "Awaiting your confirmation." },
  { key: "confirmed", label: "Confirmed", detail: "Approved and scheduled." },
  { key: "cancelled", label: "Cancelled", detail: "Released back to availability." },
  { key: "today", label: "Today", detail: "Sessions on today’s calendar." },
] as const;

const statusOptions: BookingStatus[] = ["PENDING", "CONFIRMED", "CANCELLED"];
const darkPanelClassName =
  "overflow-hidden rounded-[26px] border border-[rgba(255,255,255,0.08)] bg-[radial-gradient(circle_at_top_left,rgba(244,177,108,0.18),transparent_38%),linear-gradient(180deg,rgba(20,14,10,0.98),rgba(14,10,8,0.98))] shadow-[0_24px_80px_rgba(0,0,0,0.28)]";
const inputClassName =
  "w-full rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-white outline-none placeholder:text-[rgba(255,247,239,0.45)] focus:border-[#f4b16c]";

export function AdminDashboardSection({
  bookings,
  stats,
  activity,
  generatedAt,
  loading,
  error,
  token,
  customerFilter,
  onCustomerFilterChange,
  onRefresh,
  packages,
  packagesLoading,
  packagesError,
  packageForm,
  onPackageFormChange,
  onPackageSubmit,
  packageSaving,
}: AdminDashboardSectionProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const {
    month: calendarMonth,
    setMonth: setCalendarMonth,
    monthOptions,
    dates: availabilityDates,
  } = useBookingAvailability();

  const handleStatusChange = async (bookingId: number, status: BookingStatus) => {
    setUpdatingId(bookingId);
    try {
      await BookingApi.updateStatus(bookingId, status, token);
      await onRefresh();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-6 md:px-8 md:py-8">
      <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)]">
        <section className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[radial-gradient(circle_at_top_left,rgba(244,177,108,0.28),transparent_42%),linear-gradient(145deg,#1e140f,#100b08)] px-6 py-6 shadow-[0_24px_90px_rgba(0,0,0,0.32)] md:px-8">
          <p className="inline-flex rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#f4b16c]">
            Admin panel
          </p>
          <h2 className="mt-4 max-w-[15ch] text-[clamp(2rem,4vw,3rem)] leading-[0.92] tracking-[-0.05em] text-[#fff7ef]">
            Orchestrate bookings from one clear workspace.
          </h2>
          <p className="mt-3 max-w-[56ch] text-[0.95rem] leading-6 text-[rgba(255,247,239,0.76)]">
            Review enquiries, update statuses, watch demand, and keep your package catalog tidy
            without jumping between screens.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.28)] px-4 py-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f4b16c]">
                Today
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {stats.today} booking{stats.today === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-xs text-[rgba(255,247,239,0.68)]">
                Same-day schedule snapshot.
              </p>
            </div>
            <div className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.28)] px-4 py-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f4b16c]">
                Live sync
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {loading
                  ? "Refreshing..."
                  : generatedAt
                    ? new Date(generatedAt).toLocaleTimeString()
                    : "No data"}
              </p>
              <p className="mt-1 text-xs text-[rgba(255,247,239,0.68)]">
                Latest dashboard snapshot time.
              </p>
            </div>
          </div>
        </section>

        <section className={`${darkPanelClassName} flex flex-col justify-between p-6`}>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f4b16c]">
              Control center
            </p>
            <h3 className="mt-2 text-xl font-semibold text-[#fff7ef]">Search and refresh</h3>
          </div>

          <div className="mt-5 space-y-3">
            <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[rgba(255,247,239,0.68)]">
              Customer search
            </label>
            <input
              className={inputClassName}
              onChange={(event) => onCustomerFilterChange(event.target.value)}
              placeholder="Filter by customer name or email"
              value={customerFilter}
            />
            <button
              className="w-full rounded-2xl bg-[#f4b16c] px-5 py-3 text-sm font-semibold text-[#23170f] shadow-[0_16px_36px_rgba(244,177,108,0.28)]"
              disabled={loading}
              onClick={() => void onRefresh()}
              type="button"
            >
              {loading ? "Refreshing dashboard..." : "Refresh dashboard"}
            </button>
            <div className="rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(7,5,4,0.5)] px-4 py-3 text-sm leading-6 text-[rgba(255,247,239,0.78)]">
              {loading
                ? "Syncing bookings, packages, and activity..."
                : generatedAt
                  ? `Live snapshot as of ${new Date(generatedAt).toLocaleString()}`
                  : "No snapshot yet. Refresh to load the latest data."}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => (
          <article
            className="flex min-h-[140px] flex-col justify-between rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
            key={card.key}
          >
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f4b16c]">
                {card.label}
              </p>
              <p className="mt-3 text-[2.2rem] font-semibold leading-none tracking-[-0.05em] text-[#fff7ef]">
                {stats[card.key]}
              </p>
            </div>
            <p className="text-xs leading-5 text-[rgba(255,247,239,0.68)]">{card.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(420px,0.95fr)]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[28px] border border-[#ead8c5] bg-[#fbf3e9] text-[#241811] shadow-[0_24px_90px_rgba(0,0,0,0.16)]">
            <div className="flex min-h-[92px] flex-col justify-center gap-3 border-b border-[#ead8c5] bg-[#fff7ee] px-6 py-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#976841]">
                  Main queue
                </p>
                <h3 className="mt-2 text-xl font-semibold">Customer bookings</h3>
              </div>
              <p className="text-sm text-[#7a624f]">
                {bookings.length} booking{bookings.length === 1 ? "" : "s"} in view
              </p>
            </div>

            {loading ? (
              <p className="px-6 py-5 text-sm text-[#69513d]">Loading dashboard data...</p>
            ) : null}
            {error ? (
              <p className="px-6 py-5 text-sm text-[#9d2f2f]">Could not load bookings: {error}</p>
            ) : null}
            {!loading && !error && bookings.length === 0 ? (
              <p className="px-6 py-5 text-sm text-[#69513d]">No bookings match the current filter.</p>
            ) : null}

            {!loading && !error && bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#f4e7d8] text-left text-[0.7rem] uppercase tracking-[0.14em] text-[#69513d]">
                      <th className="px-6 py-3">Client</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Package</th>
                      <th className="px-6 py-3">Owner</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <BookingRow
                        booking={booking}
                        key={booking.id ?? `${booking.email}-${index}`}
                        onStatusChange={handleStatusChange}
                        updating={updatingId === booking.id}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>

          <section className={darkPanelClassName}>
            <div className="border-b border-[rgba(255,255,255,0.12)] px-6 py-5">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f4b16c]">
                Feed
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[#fff7ef]">Realtime activity</h3>
              <p className="mt-1 text-[0.78rem] text-[rgba(255,247,239,0.72)]">
                Recent booking and package events.
              </p>
            </div>
            <div className="space-y-4 px-6 py-5">
              {!loading && !error && activity.length === 0 ? (
                <p className="text-sm text-[rgba(255,247,239,0.72)]">No recent activity yet.</p>
              ) : null}

              {activity.map((item) => (
                <article
                  className="rounded-[20px] border border-[rgba(255,247,239,0.1)] bg-[rgba(12,8,6,0.42)] p-4"
                  key={`${item.type}-${item.id}-${item.created_at}`}
                >
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#f4b16c]">
                    {item.type.replaceAll("_", " ")}
                  </p>
                  <h4 className="mt-2 text-base font-semibold text-[#fff7ef]">{item.title}</h4>
                  <p className="mt-1 text-sm text-[rgba(255,247,239,0.8)]">{item.detail}</p>
                  {item.customer ? (
                    <p className="mt-1 text-xs text-[rgba(255,247,239,0.68)]">
                      Customer: {item.customer}
                    </p>
                  ) : null}
                  <div className="mt-3 flex items-center justify-between gap-3 text-[0.78rem] text-[rgba(255,247,239,0.68)]">
                    <span
                      className={`rounded-full px-3 py-1 text-[0.7rem] font-semibold ${getStatusPillClassName(item.status ?? "PENDING")}`}
                    >
                      {item.status ?? "PENDING"}
                    </span>
                    <span>
                      {item.created_at ? new Date(item.created_at).toLocaleString() : "Just now"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="grid items-start gap-6 xl:grid-rows-[auto_auto]">
          <section className={`${darkPanelClassName} p-6 text-[#fff7ef]`}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f4b16c]">
                  Calendar
                </p>
                <h3 className="mt-2 text-xl font-semibold">Monthly booking calendar</h3>
                <p className="mt-1 text-[0.78rem] text-[rgba(255,247,239,0.78)]">
                  Scan fully booked dates and available slots.
                </p>
              </div>
              <select
                className="rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(7,4,3,0.7)] px-4 py-2 text-sm text-white focus:border-[#f4b16c] focus:outline-none"
                onChange={(event) => setCalendarMonth(event.target.value)}
                value={calendarMonth}
              >
                {monthOptions.map((item) => (
                  <option className="text-black" key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {availabilityDates.map((day) => (
                <article
                  className={`rounded-[18px] border p-4 ${
                    day.isFullyBooked
                      ? "border-[#c45d5d] bg-[rgba(169,56,56,0.18)]"
                      : "border-[rgba(255,255,255,0.12)] bg-[rgba(12,8,6,0.4)]"
                  }`}
                  key={day.date}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{day.date}</p>
                    <span className="text-xs text-[rgba(255,247,239,0.78)]">
                      {day.bookingsCount} booking{day.bookingsCount === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[rgba(255,247,239,0.78)]">
                    {day.isFullyBooked
                      ? "Fully booked"
                      : `${day.availableSlots.length} slot${day.availableSlots.length === 1 ? "" : "s"} available`}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {day.bookedSlots.map((slot) => (
                      <span
                        className="rounded-full bg-[rgba(255,255,255,0.1)] px-3 py-1 text-[0.7rem]"
                        key={slot}
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="grid items-start gap-6 xl:grid-cols-2">
            <section className={`${darkPanelClassName} p-6 text-[#fff7ef]`}>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f4b16c]">
                Packages
              </p>
              <h3 className="mt-2 text-xl font-semibold">Add package</h3>
              <p className="mt-1 text-[0.78rem] text-[rgba(255,247,239,0.78)]">
                Create public offers for the catalog.
              </p>

              <div className="mt-4 space-y-3">
                <input
                  className={inputClassName}
                  onChange={(event) => onPackageFormChange("name", event.target.value)}
                  placeholder="Package name"
                  value={packageForm.name}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className={inputClassName}
                    onChange={(event) => onPackageFormChange("price", event.target.value)}
                    placeholder="Price (e.g. Rs 8,500)"
                    value={packageForm.price}
                  />
                  <textarea
                    className={`${inputClassName} min-h-[52px]`}
                    onChange={(event) => onPackageFormChange("featuresText", event.target.value)}
                    placeholder="Features, one per line"
                    rows={2}
                    value={packageForm.featuresText}
                  />
                </div>
                <textarea
                  className={inputClassName}
                  onChange={(event) => onPackageFormChange("description", event.target.value)}
                  placeholder="Description"
                  rows={3}
                  value={packageForm.description}
                />
                <textarea
                  className={inputClassName}
                  onChange={(event) => onPackageFormChange("enquiry_message", event.target.value)}
                  placeholder="WhatsApp enquiry message"
                  rows={2}
                  value={packageForm.enquiry_message}
                />
                {packagesError ? <p className="text-sm text-[#ffb0b0]">{packagesError}</p> : null}
                <button
                  className="w-full rounded-2xl bg-[#f4b16c] px-5 py-3 text-sm font-semibold text-[#23170f] shadow-[0_16px_36px_rgba(244,177,108,0.28)]"
                  disabled={packageSaving}
                  onClick={() => void onPackageSubmit()}
                  type="button"
                >
                  {packageSaving ? "Saving package..." : "Create package"}
                </button>
              </div>
            </section>

            <section className={darkPanelClassName}>
              <div className="border-b border-[rgba(255,255,255,0.12)] px-6 py-5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f4b16c]">
                  Catalog
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[#fff7ef]">Available packages</h3>
              </div>
              <div className="space-y-3 px-6 py-4">
                {packagesLoading ? (
                  <p className="text-sm text-[rgba(255,247,239,0.78)]">Loading packages...</p>
                ) : null}
                {!packagesLoading && packages.length === 0 ? (
                  <p className="text-sm text-[rgba(255,247,239,0.78)]">
                    No packages created yet. Add your first offer.
                  </p>
                ) : null}
                {packages.map((item) => (
                  <article
                    className="rounded-[18px] border border-[rgba(255,247,239,0.1)] bg-[rgba(12,8,6,0.42)] p-4"
                    key={item.id ?? item.name}
                  >
                    <h4 className="text-base font-semibold text-[#fff7ef]">{item.name}</h4>
                    <p className="mt-1 text-sm text-[rgba(255,247,239,0.8)]">{item.price}</p>
                    <p className="mt-2 text-sm leading-6 text-[rgba(255,247,239,0.68)]">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

type BookingRowProps = {
  booking: Booking;
  updating: boolean;
  onStatusChange: (bookingId: number, status: BookingStatus) => Promise<void>;
};

function BookingRow({ booking, updating, onStatusChange }: BookingRowProps) {
  return (
    <tr className="border-t border-[#ead8c5] text-sm transition hover:bg-[#fff7ee]">
      <td className="px-6 py-4 align-top">
        <p className="text-[0.92rem] font-semibold text-[#1d140f]">{booking.name}</p>
        <p className="text-xs text-[#69513d]">{booking.email}</p>
        {booking.phone ? <p className="text-xs text-[#8b6a50]">{booking.phone}</p> : null}
      </td>
      <td className="px-6 py-4 align-top text-[#443328]">
        <p className="text-sm">{booking.date}</p>
        <p className="text-xs text-[#8b6a50]">{booking.time_slot}</p>
      </td>
      <td className="px-6 py-4 align-top text-[#443328]">
        <span className="rounded-full bg-[#f7efe6] px-3 py-1 text-xs font-medium">
          {booking.package ?? "Custom"}
        </span>
      </td>
      <td className="px-6 py-4 align-top text-[#443328]">
        <span className="rounded-full bg-[#f7efe6] px-3 py-1 text-xs font-medium">
          {booking.user_id ? `User #${booking.user_id}` : "Guest"}
        </span>
      </td>
      <td className="px-6 py-4 align-top">
        <select
          className="rounded-full border border-[#d6c1ab] bg-white px-3 py-2 text-xs font-semibold text-[#1d140f] focus:border-[#b2855a] focus:outline-none"
          disabled={updating || !booking.id}
          onChange={(event) =>
            booking.id && void onStatusChange(booking.id, event.target.value as BookingStatus)
          }
          value={booking.status ?? "PENDING"}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}

function getStatusPillClassName(status: string) {
  if (status === "CONFIRMED") {
    return "bg-[#dff7e5] text-[#205d36]";
  }

  if (status === "CANCELLED") {
    return "bg-[#f6d6d6] text-[#8a2f2f]";
  }

  return "bg-[#f8e1bf] text-[#6e4216]";
}
