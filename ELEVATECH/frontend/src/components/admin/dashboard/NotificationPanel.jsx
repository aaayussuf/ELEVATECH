import { AlertTriangle, BellRing, PackageX } from "lucide-react";

export default function NotificationPanel({ notifications = [] }) {
  const items = Array.isArray(notifications) ? notifications : [];

  if (!items.length) {
    return (
      <div className="admin-card flex items-center gap-3 border-emerald-200 bg-emerald-50/60 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white text-lg">
          ✓
        </span>
        <div>
          <p className="font-extrabold text-emerald-900">All clear — store is healthy</p>
          <p className="text-sm text-emerald-700">No pending orders, low stock or outages right now.</p>
        </div>
      </div>
    );
  }

  const icons = {
    order: BellRing,
    stock: AlertTriangle,
    inventory: PackageX,
    review: BellRing,
  };

  const styles = {
    red: "border-red-200 bg-red-50/70",
    yellow: "border-amber-200 bg-amber-50/70",
    blue: "border-blue-200 bg-blue-50/70",
    green: "border-emerald-200 bg-emerald-50/70",
  };

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((notification, index) => {
        const Icon = icons[notification.type] || BellRing;
        return (
          <div
            key={index}
            className={`admin-card admin-card-hover border p-4 ${styles[notification.color] || "border-slate-200 bg-white"}`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-amber-300">
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <h3 className="truncate font-extrabold text-slate-900">
                  {notification.title}
                  {notification.count ? ` · ${notification.count}` : ""}
                </h3>
                <p className="truncate text-sm text-slate-600">{notification.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
