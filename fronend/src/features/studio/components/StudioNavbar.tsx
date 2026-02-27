import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AuthFormState, AuthMode, AuthSubmitResult } from "../../auth/types";
import type { AuthUser } from "../../../types/auth";

type StudioNavbarProps = {
  mode: AuthMode;
  form: AuthFormState;
  user: AuthUser | null;
  error: string | null;
  status: string | null;
  isSubmitting: boolean;
  isCheckingSession: boolean;
  unreadCount?: number;
  onModeChange: (mode: AuthMode) => void;
  onFieldChange: (field: keyof AuthFormState, value: string) => void;
  onSubmit: () => Promise<AuthSubmitResult>;
  onLogout: () => void;
};

export function StudioNavbar({
  mode,
  form,
  user,
  error,
  status,
  isSubmitting,
  isCheckingSession,
  unreadCount = 0,
  onModeChange,
  onFieldChange,
  onSubmit,
  onLogout,
}: StudioNavbarProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navButtonClassName = "cursor-pointer bg-transparent p-0 text-inherit";

  const handleRouteNavigation = (path: string) => {
    setAuthOpen(false);
    void navigate(path);
  };

  const handleSectionNavigation = (id: string) => {
    setAuthOpen(false);

    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `/#${id}`);
      return;
    }

    void navigate(`/#${id}`);
  };

  return (
    <nav className="mx-auto mb-16 flex w-full max-w-7xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <button
          className="m-0 block cursor-pointer bg-transparent p-0 text-[1.15rem] font-bold uppercase tracking-[0.12em] text-inherit"
          onClick={() => handleRouteNavigation("/")}
          type="button"
        >
          Ng
        </button>
        <p className="m-0 text-[rgba(255,247,239,0.78)]">Photo Studio</p>
      </div>
      <div className="relative flex flex-wrap items-center gap-5 text-[0.95rem] text-[rgba(255,247,239,0.78)]">
        {user?.role === "ADMIN" ? (
          <button
            className={navButtonClassName}
            onClick={() => handleRouteNavigation("/admin")}
            type="button"
          >
            Admin
          </button>
        ) : null}
        {user ? (
          <button
            className={`${navButtonClassName} relative`}
            onClick={() => handleRouteNavigation("/account")}
            type="button"
          >
            My Bookings
            {unreadCount > 0 ? (
              <span className="ml-2 rounded-full bg-[#f4b16c] px-2 py-0.5 text-xs font-bold text-[#23170f]">
                {unreadCount}
              </span>
            ) : null}
          </button>
        ) : null}
        <button
          className={navButtonClassName}
          onClick={() => handleSectionNavigation("gallery")}
          type="button"
        >
          Gallery
        </button>
        <button
          className={navButtonClassName}
          onClick={() => handleSectionNavigation("packages")}
          type="button"
        >
          Packages
        </button>
        <button
          className={navButtonClassName}
          onClick={() => handleSectionNavigation("booking")}
          type="button"
        >
          Book
        </button>
        <button
          className="rounded-full border border-[rgba(255,247,239,0.25)] px-4 py-2 text-left text-[#fff7ef] transition hover:-translate-y-0.5"
          onClick={() => setAuthOpen((current) => !current)}
          type="button"
        >
          {isCheckingSession ? "Checking..." : user ? user.name : "Login / Sign up"}
        </button>

        {authOpen ? (
          <div className="right-0 top-full z-10 mt-3 w-full min-w-[300px] rounded-[24px] border border-[rgba(255,247,239,0.12)] bg-[#fffaf4] p-5 text-[#241811] shadow-[0_18px_60px_rgba(0,0,0,0.2)] md:absolute md:w-[360px]">
            {user ? (
              <div className="space-y-3">
                <p className="m-0 text-sm uppercase tracking-[0.12em] text-[#976841]">
                  Signed in
                </p>
                <h3 className="m-0 text-2xl font-semibold text-[#1d140f]">{user.name}</h3>
                <p className="m-0 text-sm text-[#69513d]">{user.email}</p>
                <p className="m-0 text-sm text-[#69513d]">Role: {user.role}</p>
                {status ? <p className="m-0 text-sm text-[#2f6b43]">{status}</p> : null}
                <button
                  className="rounded-full bg-[#1d140f] px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5"
                  onClick={() => {
                    onLogout();
                    setAuthOpen(false);
                  }}
                  type="button"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <form
                className="grid gap-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const success = await onSubmit();
                  if (success) {
                    setAuthOpen(false);
                  }
                }}
              >
                <div className="flex gap-3">
                  <button
                    className={`rounded-full px-4 py-2 font-semibold transition ${
                      mode === "login"
                        ? "bg-[#1d140f] text-white"
                        : "border border-[#e7d8ca] text-[#1d140f]"
                    }`}
                    onClick={() => onModeChange("login")}
                    type="button"
                  >
                    Login
                  </button>
                  <button
                    className={`rounded-full px-4 py-2 font-semibold transition ${
                      mode === "signup"
                        ? "bg-[#1d140f] text-white"
                        : "border border-[#e7d8ca] text-[#1d140f]"
                    }`}
                    onClick={() => onModeChange("signup")}
                    type="button"
                  >
                    Sign up
                  </button>
                </div>

                {mode === "signup" ? (
                  <label className="grid gap-2 font-semibold text-[#1d140f]">
                    Name
                    <input
                      className="w-full rounded-2xl border border-[#e7d8ca] bg-white px-4 py-3 text-[#241811] outline-none"
                      onChange={(event) => onFieldChange("name", event.target.value)}
                      value={form.name}
                    />
                  </label>
                ) : null}

                <label className="grid gap-2 font-semibold text-[#1d140f]">
                  Email
                  <input
                    className="w-full rounded-2xl border border-[#e7d8ca] bg-white px-4 py-3 text-[#241811] outline-none"
                    onChange={(event) => onFieldChange("email", event.target.value)}
                    type="email"
                    value={form.email}
                  />
                </label>

                <label className="grid gap-2 font-semibold text-[#1d140f]">
                  Password
                  <input
                    className="w-full rounded-2xl border border-[#e7d8ca] bg-white px-4 py-3 text-[#241811] outline-none"
                    onChange={(event) => onFieldChange("password", event.target.value)}
                    type="password"
                    value={form.password}
                  />
                </label>

                {mode === "signup" ? (
                  <label className="grid gap-2 font-semibold text-[#1d140f]">
                    Confirm password
                    <input
                      className="w-full rounded-2xl border border-[#e7d8ca] bg-white px-4 py-3 text-[#241811] outline-none"
                      onChange={(event) => onFieldChange("confirmPassword", event.target.value)}
                      type="password"
                      value={form.confirmPassword}
                    />
                  </label>
                ) : null}

                <button
                  className="rounded-full bg-[#f4b16c] px-6 py-4 font-bold text-[#23170f] transition hover:-translate-y-0.5 disabled:cursor-progress disabled:opacity-70"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : mode === "signup"
                      ? "Create account"
                      : "Log in"}
                </button>

                {status ? <p className="m-0 text-sm text-[#2f6b43]">{status}</p> : null}
                {error ? <p className="m-0 text-sm text-[#9d2f2f]">{error}</p> : null}
              </form>
            )}
          </div>
        ) : null}
      </div>
    </nav>
  );
}
