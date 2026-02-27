export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Booking {
  id?: number;
  user_id?: number | null;
  name: string;
  email: string;
  phone?: string | null;
  date: string; // YYYY-MM-DD
  time_slot: string;
  package?: string | null;
  message?: string | null;
  status?: BookingStatus;
  status_updated_at?: string | null;
  status_seen_at?: string | null;
  created_at?: string;
}
