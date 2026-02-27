import { Navigate } from "react-router-dom";
import { AdminDashboardSection } from "../components/AdminDashboardSection";
import { AdminLayout } from "../components/AdminLayout";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { useAdminPackages } from "../hooks/useAdminPackages";
import type { AuthUser } from "../../../types/auth";

type AdminPageProps = {
  user: AuthUser | null;
  token: string | null;
  isCheckingSession: boolean;
  onLogout: () => void;
};

export function AdminPage({ user, token, isCheckingSession, onLogout }: AdminPageProps) {
  const {
    bookings,
    stats,
    activity,
    generated_at,
    loading,
    error,
    customerFilter,
    setCustomerFilter,
    refresh,
  } = useAdminDashboard(user, token);
  const {
    packages,
    loading: packagesLoading,
    error: packagesError,
    form,
    setForm,
    saving,
    submit,
  } = useAdminPackages(token ?? "");

  if (isCheckingSession) {
    return <div className="min-h-screen bg-[#140f0c]" />;
  }

  if (!user || !token || user.role !== "ADMIN") {
    return <Navigate replace to="/" />;
  }

  return (
    <AdminLayout onLogout={onLogout} user={user}>
      <AdminDashboardSection
        activity={activity}
        bookings={bookings}
        customerFilter={customerFilter}
        error={error}
        generatedAt={generated_at}
        loading={loading}
        onCustomerFilterChange={setCustomerFilter}
        onRefresh={refresh}
        onPackageFormChange={(field, value) =>
          setForm((current) => ({
            ...current,
            [field]: value,
          }))
        }
        onPackageSubmit={submit}
        stats={stats}
        token={token}
        packageForm={form}
        packageSaving={saving}
        packages={packages}
        packagesError={packagesError}
        packagesLoading={packagesLoading}
      />
    </AdminLayout>
  );
}
