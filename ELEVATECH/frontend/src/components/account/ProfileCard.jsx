import { Mail, Phone, ShieldCheck } from "lucide-react";

export default function ProfileCard({ user }) {
  if (!user) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-6 text-sm font-bold text-gray-500">
        No profile loaded.
      </div>
    );
  }

  const initials =
    `${(user.first_name || "")[0] || ""}${(user.last_name || "")[0] || ""}`.toUpperCase() ||
    "EV";

  const joined = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-yellow-400 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/25 text-2xl font-black text-white ring-2 ring-white/30 ring-inset backdrop-blur">
          {initials}
        </div>
        <div>
          <h3 className="text-xl font-black text-white">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-sm font-semibold text-white/85">{user.email}</p>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Mail size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Email</p>
            <p className="truncate font-bold text-gray-900">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <Phone size={18} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Phone</p>
            <p className="font-bold text-gray-900">{user.phone || "—"}</p>
          </div>
        </div>

        {joined && (
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 sm:col-span-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Member since
              </p>
              <p className="font-bold text-gray-900">{joined}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

