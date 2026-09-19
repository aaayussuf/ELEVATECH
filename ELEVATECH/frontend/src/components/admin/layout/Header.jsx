import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Bell, LogOut, ShieldCheck } from "lucide-react";

export default function Header({ alerts = 0 }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  const displayName =
    user?.first_name || user?.name
      ? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
        user?.name ||
        user?.email
      : user?.email || "Admin";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-amber-600">
          Elevatech Control Center
        </p>
        <h1 className="truncate text-lg sm:text-xl font-black text-slate-900">
          Admin Panel
        </h1>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div
          className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
          title="Alerts"
        >
          <Bell size={18} />
          {alerts > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-black text-white">
              {alerts > 9 ? "9+" : alerts}
            </span>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-slate-900">
            <ShieldCheck size={16} />
          </span>
          <span className="max-w-[160px] truncate text-sm font-bold">
            {displayName}
          </span>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-emerald-300">
            Admin
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="admin-btn admin-btn-auto admin-btn-danger !min-h-[44px] !py-2 text-sm"
        >
          <LogOut size={16} />
          <span className="hidden min-[480px]:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}


