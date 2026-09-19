export default function StatCard({
  title,
  value,
  change,
  icon,
  tone = "navy",
  hint,
}) {
  const tones = {
    navy: "bg-slate-900 text-amber-300",
    gold: "bg-gradient-to-br from-amber-300 to-amber-500 text-slate-900",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-violet-100 text-violet-700",
    red: "bg-red-100 text-red-700",
  };
  const changeVal = change === null || change === undefined || change === "" ? null : Number(change);
  return (
    <div className="admin-card admin-card-hover p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            {title}
          </p>
          <h2 className="mt-2 truncate text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            {value}
          </h2>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
          {changeVal !== null && !Number.isNaN(changeVal) && (
            <p
              className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${
                changeVal >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <span>{changeVal >= 0 ? "▲" : "▼"}</span>
              {changeVal >= 0 ? "+" : ""}{changeVal}% vs last week
            </p>
          )}
        </div>
        <div className={`admin-stat-icon ${tones[tone] || tones.navy}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
