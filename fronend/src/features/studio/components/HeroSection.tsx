import { heroStats } from "../data/content";
import { StudioNavbar } from "./StudioNavbar";
import type { AuthFormState, AuthMode, AuthSubmitResult } from "../../auth/types";
import type { AuthUser } from "../../../types/auth";

type HeroSectionProps = {
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

export function HeroSection(props: HeroSectionProps) {
  return (
    <header className="bg-[radial-gradient(circle_at_top_left,rgba(194,123,63,0.28),transparent_32%),linear-gradient(135deg,#18110d_0%,#2b211a_45%,#f0e1ce_160%)] px-5 pt-8 pb-20 text-[#fff7ef] md:px-8">
      <StudioNavbar {...props} />

      <div className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)] md:items-end">
        <section>
          <p className="mb-3 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-[#976841]">
            Editorial portraits, weddings, and family sessions
          </p>
          <h1 className="m-0 max-w-[10ch] text-[clamp(3.25rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.04em] md:max-w-[10ch]">
            Photography for moments that should look as strong as they felt.
          </h1>
          <p className="mt-6 max-w-[58ch] text-[1.05rem] text-[rgba(255,247,239,0.86)]">
            A full-service photo studio for polished portraits, cinematic wedding stories,
            and natural family sessions. Built for clients who want clear direction and
            sharp final work.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              className="rounded-full bg-[#f4b16c] px-6 py-4 font-bold text-[#23170f] transition hover:-translate-y-0.5"
              href="#booking"
            >
              Reserve a session
            </a>
            <a
              className="rounded-full border border-[rgba(255,247,239,0.25)] px-6 py-4 text-[#fff7ef] transition hover:-translate-y-0.5"
              href="#gallery"
            >
              View portfolio
            </a>
          </div>
        </section>

        <section className="grid gap-4 rounded-[24px] border border-[rgba(255,247,239,0.12)] bg-[rgba(255,247,239,0.08)] p-6 backdrop-blur-[12px]">
          {heroStats.map((stat) => (
            <div key={stat.label}>
              <strong className="block text-[2rem] text-[#fff7ef]">{stat.value}</strong>
              <span className="text-[rgba(255,247,239,0.75)]">{stat.label}</span>
            </div>
          ))}
        </section>
      </div>
    </header>
  );
}
