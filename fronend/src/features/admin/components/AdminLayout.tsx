import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AuthUser } from "../../../types/auth";

type AdminLayoutProps = {
  user: AuthUser;
  onLogout: () => void;
  children: ReactNode;
};

export function AdminLayout({ user, onLogout, children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navButtonClassName = (path: string) =>
    `rounded-full px-4 py-2 text-sm transition ${
      location.pathname === path
        ? "bg-[#f4b16c] font-semibold text-[#23170f] shadow-[0_10px_30px_rgba(244,177,108,0.25)]"
        : "border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.03)] text-white hover:bg-[rgba(255,255,255,0.08)]"
    }`;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(244,177,108,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(130,86,52,0.18),transparent_24%),linear-gradient(180deg,#120d0b_0%,#1a120f_42%,#221711_100%)] text-[#fdf6ee]">
      <header className="border-b border-[rgba(255,255,255,0.08)] bg-[rgba(15,10,8,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 md:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold uppercase tracking-[0.22em] text-[#f4b16c]">
              Admin dashboard
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#fff7ef] md:text-[2rem]">
              NG Studio
            </h1>
            <p className="mt-1 max-w-[56ch] text-sm text-[rgba(255,247,239,0.66)]">
              Monitor incoming bookings, update customer status, and keep package offers current.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 text-left lg:text-right">
              <p className="m-0 font-semibold">{user.name}</p>
              <p className="m-0 text-sm text-[rgba(255,247,239,0.68)]">{user.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className={navButtonClassName("/admin")}
                onClick={() => void navigate("/admin")}
                type="button"
              >
                Admin
              </button>
              <button
                className={navButtonClassName("/account")}
                onClick={() => void navigate("/account")}
                type="button"
              >
                My Bookings
              </button>
              <button
                className={navButtonClassName("/")}
                onClick={() => void navigate("/")}
                type="button"
              >
                Website
              </button>
            </div>
            <button
              className="rounded-full bg-[#f4b16c] px-4 py-2 text-sm font-semibold text-[#23170f] shadow-[0_12px_30px_rgba(244,177,108,0.25)]"
              onClick={onLogout}
              type="button"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
