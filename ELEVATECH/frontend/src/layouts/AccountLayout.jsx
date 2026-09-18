import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

import Sidebar from "../components/account/Sidebar";

export default function AccountLayout({ children, onLogout, user }) {
  const navigate = useNavigate();

  const fullName = useMemo(() => {
    const first = user?.first_name || user?.firstName || "";
    const last = user?.last_name || user?.lastName || "";

    return `${first} ${last}`.trim() || "Customer";
  }, [user]);

  const initials = useMemo(() => {
    const parts = fullName.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";

    return `${first}${second}`.toUpperCase() || "EV";
  }, [fullName]);

  const handleLogout = onLogout || (() => navigate("/login"));

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#07101D] text-white">
      {/* Decorative background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-48 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl sm:h-[540px] sm:w-[540px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/3 h-[360px] w-[360px] rounded-full bg-yellow-400/10 blur-3xl sm:h-[460px] sm:w-[460px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 h-[260px] w-[260px] rounded-full bg-blue-400/5 blur-3xl sm:h-[320px] sm:w-[320px]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* Account header */}
        <header className="relative mb-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0C1730] via-[#101E38] to-[#0A1424] p-4 shadow-xl sm:mb-6 sm:rounded-3xl sm:p-6 lg:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_55%)]"
          />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            {/* Customer information */}
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-yellow-400 text-xl font-black text-black shadow-[0_10px_30px_-8px_rgba(59,130,246,0.6)] sm:h-16 sm:w-16 sm:rounded-2xl sm:text-2xl"
              >
                {initials}
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-yellow-400 sm:text-[11px] sm:tracking-[0.2em]">
                  <Sparkles size={13} aria-hidden="true" />
                  My Account
                </p>

                <h1 className="mt-1 break-words text-xl font-black leading-tight sm:text-3xl">
                  Welcome back, {fullName}
                </h1>

                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-gray-400 sm:text-sm">
                  Manage your orders, addresses and profile — all in one place.
                </p>
              </div>
            </div>

            {/* Account actions */}
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 lg:shrink-0">
              <span className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-center text-[11px] font-bold leading-tight text-gray-300 sm:w-auto sm:px-4 sm:text-xs">
                <ShieldCheck
                  size={15}
                  className="shrink-0 text-yellow-400"
                  aria-hidden="true"
                />
                <span>ELEVATECH Preferred Customer</span>
              </span>

              <Link
                to="/"
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:ring-offset-2 focus:ring-offset-[#101E38] sm:w-auto"
              >
                <ArrowLeft size={15} aria-hidden="true" />
                Back to shop
              </Link>
            </div>
          </div>
        </header>

        {/* Account content */}
        <div className="grid min-w-0 items-start gap-4 sm:gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="min-w-0 lg:sticky lg:top-6">
            <Sidebar
              onLogout={handleLogout}
              basePath="/account"
            />
          </aside>

          {/* Main page */}
          <main className="min-h-[60vh] min-w-0 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}


