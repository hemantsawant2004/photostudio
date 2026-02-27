import type { Booking } from "../../../types/booking";

type AccountHistorySectionProps = {
  bookings: Booking[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  onMarkSeen: () => Promise<void>;
};

export function AccountHistorySection({
  bookings,
  unreadCount,
  loading,
  error,
  onMarkSeen,
}: AccountHistorySectionProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-[#976841]">
            Your account
          </p>
          <h2 className="m-0 max-w-[14ch] text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.04em] text-[#1d140f]">
            Booking history and latest status updates.
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#fffaf4] px-4 py-2 text-sm text-[#69513d] shadow-[0_12px_40px_rgba(54,33,17,0.08)]">
            {unreadCount} unread update{unreadCount === 1 ? "" : "s"}
          </div>
          <button
            className="rounded-full bg-[#1d140f] px-5 py-3 text-sm font-semibold text-white"
            onClick={() => void onMarkSeen()}
            type="button"
          >
            Mark updates seen
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] bg-[#fffaf4] shadow-[0_18px_60px_rgba(54,33,17,0.08)]">
        <div className="border-b border-[#eee1d3] px-6 py-4">
          <h3 className="m-0 text-xl font-semibold text-[#1d140f]">All your bookings</h3>
        </div>

        {loading ? <p className="m-0 px-6 py-5 text-[#69513d]">Loading your history...</p> : null}
        {error ? <p className="m-0 px-6 py-5 text-[#9d2f2f]">{error}</p> : null}
        {!loading && !error && bookings.length === 0 ? (
          <p className="m-0 px-6 py-5 text-[#69513d]">You have not made any bookings yet.</p>
        ) : null}

        {!loading && !error && bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-[#f7efe6] text-left text-sm uppercase tracking-[0.08em] text-[#69513d]">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Package</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Updated</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <HistoryRow booking={booking} key={booking.id} />
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function HistoryRow({ booking }: { booking: Booking }) {
  const unread =
    booking.status !== "PENDING" && booking.status_updated_at && !booking.status_seen_at;

  return (
    <tr className="border-t border-[#eee1d3]">
      <td className="px-6 py-4 text-[#443328]">
        <p className="m-0">{booking.date}</p>
        <p className="m-0 text-sm text-[#8b6a50]">{booking.time_slot}</p>
      </td>
      <td className="px-6 py-4 text-[#443328]">{booking.package ?? "Custom"}</td>
      <td className="px-6 py-4 text-[#443328]">{booking.message ?? "No notes provided."}</td>
      <td className="px-6 py-4">
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            unread ? "bg-[#f4b16c] text-[#23170f]" : "bg-[#f7efe6] text-[#1d140f]"
          }`}
        >
          {booking.status ?? "PENDING"}
        </span>
      </td>
      <td className="px-6 py-4 text-[#443328]">
        {booking.status_updated_at
          ? new Date(booking.status_updated_at).toLocaleString()
          : "Not updated yet"}
      </td>
    </tr>
  );
}
