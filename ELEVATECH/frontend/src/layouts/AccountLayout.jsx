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
    const parts = fullName.split(" ").filter(Boolean);
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    return `${first}${second}`.toUpperCase() || "EV";
  }, [fullName]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07101D] text-white">
      {/* Decorative background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -left-40 h-[540px] w-[540px] rounded-full bg-blue-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-40 h-[460px] w-[460px] rounded-full bg-yellow-400/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-blue-400/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Hero header */}
        <header className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0C1730] via-[#101E38] to-[#0A1424] p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_55%)]"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-yellow-400 text-2xl font-black text-black shadow-[0_10px_30px_-8px_rgba(59,130,246,0.6)]">
                {initials}
              </div>

              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-yellow-400">
                  <Sparkles size={13} /> My Account
                </p>
                <h1 className="mt-1 text-2xl font-black sm:text-3xl">
                  Welcome back, {fullName}
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                  Manage your orders, addresses and profile — all in one place.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300">
                <ShieldCheck size={15} className="text-yellow-400" />
                ELEVATECH Preferred Customer
              </span>

              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
              >
                <ArrowLeft size={15} />
                Back to shop
              </Link>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="grid items-start gap-4 sm:gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-6 min-w-0">
            <Sidebar
              onLogout={onLogout || (() => navigate("/login"))}
              basePath="/account"
            />
          </div>

          <main className="min-h-[60vh] min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

