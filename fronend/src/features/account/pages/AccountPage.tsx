import { Navigate } from "react-router-dom";
import { AccountHistorySection } from "../components/AccountHistorySection";
import { useMyBookings } from "../hooks/useMyBookings";
import { StudioNavbar } from "../../studio/components/StudioNavbar";
import type { AuthFormState, AuthMode, AuthSubmitResult } from "../../auth/types";
import type { AuthUser } from "../../../types/auth";

type AccountPageProps = {
  mode: AuthMode;
  form: AuthFormState;
  user: AuthUser | null;
  token: string | null;
  error: string | null;
  status: string | null;
  isSubmitting: boolean;
  isCheckingSession: boolean;
  onModeChange: (mode: AuthMode) => void;
  onFieldChange: (field: keyof AuthFormState, value: string) => void;
  onSubmit: () => Promise<AuthSubmitResult>;
  onLogout: () => void;
};

export function AccountPage(props: AccountPageProps) {
  const { bookings, unreadCount, loading, error, markSeen } = useMyBookings(props.token);

  if (props.isCheckingSession) {
    return <div className="min-h-screen bg-[#f7efe6]" />;
  }

  if (!props.user || !props.token) {
    return <Navigate replace to="/" />;
  }

  return (
    <div className="min-h-screen bg-[#f7efe6] text-[#241811]">
      <header className="bg-[radial-gradient(circle_at_top_left,rgba(194,123,63,0.28),transparent_32%),linear-gradient(135deg,#18110d_0%,#2b211a_45%,#f0e1ce_160%)] px-5 pt-8 pb-10 text-[#fff7ef] md:px-8">
        <StudioNavbar
          error={props.error}
          form={props.form}
          isCheckingSession={props.isCheckingSession}
          isSubmitting={props.isSubmitting}
          mode={props.mode}
          onFieldChange={props.onFieldChange}
          onLogout={props.onLogout}
          onModeChange={props.onModeChange}
          onSubmit={props.onSubmit}
          status={props.status}
          unreadCount={unreadCount}
          user={props.user}
        />
      </header>
      <main>
        <AccountHistorySection
          bookings={bookings}
          error={error}
          loading={loading}
          onMarkSeen={markSeen}
          unreadCount={unreadCount}
        />
      </main>
    </div>
  );
}
