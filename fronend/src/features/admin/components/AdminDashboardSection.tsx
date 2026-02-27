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
  { key: "total", label: "Total bookings" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "today", label: "Today" },
] as const;

const statusOptions: BookingStatus[] = ["PENDING", "CONFIRMED", "CANCELLED"];

const darkPanelClassName =
  "overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[radial-gradient(circle_at_top_left,rgba(244,177,108,0.22),transparent_45%),linear-gradient(145deg,rgba(14,10,7,0.98),rgba(24,16,10,0.98))] shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl";

const inputClassName =
  "rounded-2xl border border-[rgba(255,255,255,0.14)] bg-[rgba(7,4,3,0.65)] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[rgba(255,247,239,0.45)] focus:border-[#f4b16c] focus:ring-2 focus:ring-[#f4b16c]/40";

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
    <section className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8 md:py-10">
      {/* TOP ROW: HERO + CONTROL CENTER */}
      <div className="mb-7 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
        {/* Hero panel */}
        <div className="relative overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[radial-gradient(circle_at_top_left,rgba(244,177,108,0.32),transparent_40%),linear-gradient(145deg,#20140d,#0f0b08)] px-6 py-7 shadow-[0_24px_90px_rgba(0,0,0,0.4)] md:px-8">
          <div className="pointer-events-none absolute -right-16 top-[-40px] h-40 w-40 rounded-full border border-[rgba(255,255,255,0.09)] bg-[radial-gradient(circle,rgba(255,255,255,0.22),transparent_60%)] opacity-40" />
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#f4b16c]">
            Admin panel
          </p>
          <h2 className="m-0 max-w-[18ch] text-[clamp(2rem,4vw,3.25rem)] leading-[0.9] tracking-[-0.05em] text-[#fff7ef]">
            Orchestrate every booking from a single view.
          </h2>
          <p className="mt-4 max-w-[52ch] text-[0.98rem] leading-6 text-[rgba(255,247,239,0.78)]">
            Review enquiries, confirm or cancel sessions, track daily demand, and fine-tune your
            package catalog — all without leaving this dashboard.
          </p>

          <div className="mt-5 grid gap-3 text-xs text-[rgba(255,247,239,0.8)] sm:grid-cols-2">
            <div className="rounded-2xl bg-[rgba(0,0,0,0.34)] p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#f4b16c]">
                Today
              </p>
              <p className="mt-2 text-[1.25rem] font-semibold text-white">
                {stats.today} booking{stats.today === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-[0.8rem] text-[rgba(255,247,239,0.7)]">
                Keep an eye on same-day schedule and last-minute changes.
              </p>
            </div>
            <div className="rounded-2xl bg-[rgba(0,0,0,0.34)] p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#f4b16c]">
                Live status
              </p>
              <p className="mt-2 text-[1.25rem] font-semibold text-white">
                {loading
                  ? "Refreshing..."
                  : generatedAt
                    ? new Date(generatedAt).toLocaleTimeString()
                    : "Waiting for data"}
              </p>
              <p className="mt-1 text-[0.8rem] text-[rgba(255,247,239,0.7)]">
                Stats auto-sync when you refresh the dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Control center */}
        <div className={`${darkPanelClassName} p-6`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#f4b16c]">
                Control center
              </p>
              <h3 className="mt-2 m-0 text-lg font-semibold text-[#fff7ef]">
                Filter & refresh bookings
              </h3>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="space-y-1.5">
              <label className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[rgba(255,247,239,0.68)]">
                Customer search
              </label>
              <input
                className={`${inputClassName} w-full`}
                onChange={(event) => onCustomerFilterChange(event.target.value)}
                placeholder="Filter by customer name or email"
                value={customerFilter}
              />
            </div>

            <button
              className="flex w-full items-center justify-center rounded-2xl bg-[#f4b16c] px-5 py-2.5 text-sm font-semibold text-[#23170f] shadow-[0_16px_40px_rgba(244,177,108,0.35)] transition hover:brightness-110 disabled:opacity-70"
              onClick={() => void onRefresh()}
              type="button"
              disabled={loading}
            >
              {loading ? "Refreshing dashboard..." : "Refresh dashboard"}
            </button>

            <div className="mt-3 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(7,5,4,0.6)] px-4 py-3 text-[0.8rem] text-[rgba(255,247,239,0.8)]">
              {loading
                ? "Syncing latest bookings, activity, and package data…"
                : generatedAt
                  ? `Live snapshot as of ${new Date(generatedAt).toLocaleString()}`
                  : "No snapshot yet. Click refresh to load the latest data."}
            </div>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => (
          <article
            className="group relative overflow-hidden rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[radial-gradient(circle_at_top,rgba(244,177,108,0.18),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(0,0,0,0.35)]"
            key={card.key}
          >
            <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f4b16c]">
              {card.label}
            </p>
            <p className="mt-3 mb-1 text-[2.1rem] font-semibold leading-none tracking-[-0.06em] text-[#fff7ef]">
              {stats[card.key]}
            </p>
            <p className="m-0 text-[0.75rem] text-[rgba(255,247,239,0.7)]">
              {card.key === "total"
                ? "All bookings in the system."
                : card.key === "pending"
                  ? "Awaiting your confirmation."
                  : card.key === "confirmed"
                    ? "Locked in and ready."
                    : card.key === "cancelled"
                      ? "Cancelled / released slots."
                      : "Sessions booked for today only."}
            </p>
          </article>
        ))}
      </div>

      {/* MAIN GRID: BOOKINGS + ACTIVITY + RIGHT SIDEBAR */}
      <div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(420px,0.95fr)]">
        {/* LEFT COLUMN: BOOKINGS + ACTIVITY */}
        <div className="space-y-7">
          {/* BOOKINGS TABLE */}
          <div className="overflow-hidden rounded-[30px] border border-[#ead8c5] bg-[#fbf3e9] text-[#241811] shadow-[0_24px_90px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col gap-3 border-b border-[#ead8c5] bg-[#fff7ee] px-6 py-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#976841]">
                  Main queue
                </p>
                <h3 className="mt-2 m-0 text-xl font-semibold">Customer bookings</h3>
              </div>
              <p className="m-0 text-sm text-[#7a624f]">
                {bookings.length} booking{bookings.length === 1 ? "" : "s"} in view
              </p>
            </div>

            {loading && (
              <p className="m-0 px-6 py-5 text-sm text-[#69513d]">Loading dashboard data…</p>
            )}
            {error && (
              <p className="m-0 px-6 py-5 text-sm text-[#9d2f2f]">
                Couldn&apos;t load bookings: {error}
              </p>
            )}
            {!loading && !error && bookings.length === 0 && (
              <p className="m-0 px-6 py-5 text-sm text-[#69513d]">
                No bookings match the current filter.
              </p>
            )}

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
          </div>

          {/* ACTIVITY FEED */}
          <aside className={darkPanelClassName}>
            <div className="border-b border-[rgba(255,255,255,0.12)] px-6 py-5">
              <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f4b16c]">
                Feed
              </p>
              <h3 className="mt-2 m-0 text-xl font-semibold text-[#fff7ef]">Realtime activity</h3>
              <p className="mt-1 text-[0.78rem] text-[rgba(255,247,239,0.72)]">
                See the latest actions on bookings and packages as they happen.
              </p>
            </div>
            <div className="space-y-4 px-6 py-5">
              {!loading && !error && activity.length === 0 && (
                <p className="m-0 text-sm text-[rgba(255,247,239,0.72)]">No recent activity yet.</p>
              )}

              {activity.map((item) => (
                <article
                  className="rounded-[22px] border border-[rgba(255,247,239,0.12)] bg-[rgba(12,8,6,0.45)] p-4"
                  key={`${item.type}-${item.id}-${item.created_at}`}
                >
                  <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#f4b16c]">
                    {item.type.replaceAll("_", " ")}
                  </p>
                  <h4 className="mt-2 text-base font-semibold text-[#fff7ef]">{item.title}</h4>
                  <p className="mt-1 mb-0 text-sm text-[rgba(255,247,239,0.8)]">{item.detail}</p>
                  {item.customer && (
                    <p className="mt-1 mb-0 text-xs text-[rgba(255,247,239,0.7)]">
                      Customer: {item.customer}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between gap-3 text-[0.78rem] text-[rgba(255,247,239,0.7)]">
                    <span
                      className={`rounded-full px-3 py-1 text-[0.7rem] font-semibold ${getStatusPillClassName(item.status ?? "PENDING")}`}
                    >
                      {item.status ?? "PENDING"}
                    </span>
                    <span>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "Just now"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>

        {/* RIGHT COLUMN: CALENDAR + PACKAGES */}
        <div className="grid gap-7 xl:grid-rows-[auto_auto]">
          {/* CALENDAR */}
          <section className={`${darkPanelClassName} p-6 text-[#fff7ef]`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f4b16c]">
                  Calendar
                </p>
                <h3 className="mt-2 m-0 text-xl font-semibold">Monthly booking calendar</h3>
                <p className="mt-1 text-[0.78rem] text-[rgba(255,247,239,0.8)]">
                  Quickly scan which days are fully booked and where you still have open slots.
                </p>
              </div>
              <select
                className="rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(7,4,3,0.7)] px-4 py-2 text-sm text-white focus:border-[#f4b16c] focus:outline-none focus:ring-2 focus:ring-[#f4b16c]/40"
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
                  className={`rounded-[18px] border p-4 transition ${
                    day.isFullyBooked
                      ? "border-[#c45d5d] bg-[rgba(169,56,56,0.18)]"
                      : "border-[rgba(255,255,255,0.15)] bg-[rgba(12,8,6,0.45)]"
                  }`}
                  key={day.date}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="m-0 text-sm font-semibold">{day.date}</p>
                    <span className="text-xs text-[rgba(255,247,239,0.8)]">
                      {day.bookingsCount} booking{day.bookingsCount === 1 ? "" : "s"}
                    </span>
                  </div>
                  <p className="mt-2 mb-0 text-xs text-[rgba(255,247,239,0.8)]">
                    {day.isFullyBooked
                      ? "Fully booked"
                      : `${day.availableSlots.length} slot${day.availableSlots.length === 1 ? "" : "s"} available`}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {day.bookedSlots.map((slot) => (
                      <span
                        className="rounded-full bg-[rgba(255,255,255,0.12)] px-3 py-1 text-[0.7rem]"
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

          {/* PACKAGES AREA */}
          <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* CREATE PACKAGE */}
            <section className={`${darkPanelClassName} p-6 text-[#fff7ef]`}>
              <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f4b16c]">
                Packages
              </p>
              <h3 className="mt-2 m-0 text-xl font-semibold">Add package</h3>
              <p className="mt-1 text-[0.78rem] text-[rgba(255,247,239,0.8)]">
                Create curated packages that appear instantly in your public catalog.
              </p>

              <div className="mt-4 space-y-3">
                <input
                  className={`${inputClassName} w-full`}
                  onChange={(event) => onPackageFormChange("name", event.target.value)}
                  placeholder="Package name (e.g. Portrait Session)"
                  value={packageForm.name}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className={inputClassName}
                    onChange={(event) => onPackageFormChange("price", event.target.value)}
                    placeholder="Price (e.g. ₹8,500)"
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
                  className={`${inputClassName} w-full`}
                  onChange={(event) => onPackageFormChange("description", event.target.value)}
                  placeholder="Short description of what this package includes"
                  rows={3}
                  value={packageForm.description}
                />
                <textarea
                  className={`${inputClassName} w-full`}
                  onChange={(event) => onPackageFormChange("enquiry_message", event.target.value)}
                  placeholder="Pre-filled WhatsApp enquiry message"
                  rows={2}
                  value={packageForm.enquiry_message}
                />
                {packagesError && (
                  <p className="m-0 text-sm text-[#ffb0b0]">{packagesError}</p>
                )}
                <button
                  className="mt-1 flex w-full items-center justify-center rounded-2xl bg-[#f4b16c] px-5 py-2.5 text-sm font-semibold text-[#23170f] shadow-[0_16px_40px_rgba(244,177,108,0.35)] transition hover:brightness-110 disabled:opacity-70"
                  onClick={() => void onPackageSubmit()}
                  type="button"
                  disabled={packageSaving}
                >
                  {packageSaving ? "Saving package..." : "Create package"}
                </button>
              </div>
            </section>

            {/* PACKAGE LIST */}
            <section className={darkPanelClassName}>
              <div className="border-b border-[rgba(255,255,255,0.12)] px-6 py-5">
                <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f4b16c]">
                  Catalog
                </p>
                <h3 className="mt-2 m-0 text-xl font-semibold text-[#fff7ef]">
                  Available packages
                </h3>
              </div>
              <div className="space-y-3 px-6 py-4">
                {packagesLoading && (
                  <p className="m-0 text-sm text-[rgba(255,247,239,0.78)]">
                    Loading packages…
                  </p>
                )}
                {!packagesLoading && packages.length === 0 && (
                  <p className="m-0 text-sm text-[rgba(255,247,239,0.78)]">
                    No packages created yet. Start by adding your first offer.
                  </p>
                )}
                {packages.map((item) => (
                  <article
                    className="rounded-[18px] border border-[rgba(255,247,239,0.14)] bg-[rgba(12,8,6,0.5)] p-4"
                    key={item.id ?? item.name}
                  >
                    <div>
                      <h4 className="m-0 text-base font-semibold">{item.name}</h4>
                      <p className="mt-1 mb-0 text-sm text-[rgba(255,247,239,0.82)]">
                        {item.price}
                      </p>
                      <p className="mt-2 mb-0 text-[0.85rem] leading-6 text-[rgba(255,247,239,0.7)]">
                        {item.description}
                      </p>
                    </div>
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
        <p className="m-0 text-[0.92rem] font-semibold text-[#1d140f]">{booking.name}</p>
        <p className="m-0 text-xs text-[#69513d]">{booking.email}</p>
        {booking.phone && (
          <p className="m-0 text-xs text-[#8b6a50]">{booking.phone}</p>
        )}
      </td>
      <td className="px-6 py-4 align-top text-[#443328]">
        <p className="m-0 text-sm">{booking.date}</p>
        <p className="m-0 text-xs text-[#8b6a50]">{booking.time_slot}</p>
      </td>
      <td className="px-6 py-4 align-top text-[#443328]">
        <span className="rounded-full bg-[#f7efe6] px-3 py-1 text-xs font-medium">
          {booking.package ?? "Custom"}
        </span>
      </td>
      <td className="px-6 py-4 align-top text-[#443328]">
        <span className="rounded-full bg-[#f7efe6] px-3 py-1 text-xs font-medium text-[#443328]">
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