import { NavLink } from "react-router-dom";
import {
  Heart,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Package,
  UserRound,
} from "lucide-react";

const links = [
  { to: "/account/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/account/orders", label: "My Orders", icon: Package },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
  { to: "/account/addresses", label: "Addresses", icon: MapPinned },
  { to: "/account/profile", label: "Profile", icon: UserRound },
  { to: "/account/password", label: "Change Password", icon: KeyRound },
];

export default function Sidebar({ onLogout, basePath = "/account" }) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-[#0B1526]/90 p-4 backdrop-blur lg:sticky lg:top-6">
      <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-yellow-400 text-sm font-black text-black">
          EV
        </div>
        <div>
          <div className="text-sm font-black leading-tight">My Account</div>
          <div className="text-xs text-gray-500">Customer area</div>
        </div>
      </div>

      <nav className="space-y-1.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                isActive
                  ? "bg-gradient-to-r from-blue-600/25 to-yellow-500/10 text-white ring-1 ring-inset ring-blue-400/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-xl transition",
                    isActive
                      ? "bg-gradient-to-br from-blue-500 to-yellow-400 text-black"
                      : "bg-white/5 text-gray-400 group-hover:text-white",
                  ].join(" ")}
                >
                  <Icon size={16} />
                </span>
                {label}

                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-yellow-400" />
                )}
              </>
            )}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={onLogout}
          className="group mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition group-hover:bg-red-500/20">
            <LogOut size={16} />
          </span>
          Logout
        </button>
      </nav>
    </aside>
  );
}

