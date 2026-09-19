import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = ["#0b1526", "#1e3a8a", "#b45309", "#0f766e", "#7c3aed"];

export default function TopProductsChart({ products }) {
  const rows = Array.isArray(products) ? products : [];
  return (
    <div className="admin-card p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            Best Sellers
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Top products by units sold
          </p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
          Top {rows.length || 5}
        </span>
      </div>

      {!rows.length ? (
        <div className="flex h-[300px] flex-col items-center justify-center text-center">
          <div className="mb-2 text-4xl">🏆</div>
          <p className="font-bold text-slate-700">No sales yet</p>
          <p className="text-sm text-slate-500">
            Best sellers will appear here once orders are paid.
          </p>
        </div>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 16 }}>
              <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fontSize: 12, fill: "#0f172a", fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (String(v).length > 18 ? `${String(v).slice(0, 18)}…` : v)}
              />
              <Tooltip
                formatter={(value) => [`${value} sold`, "Units"]}
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
              />
              <Bar dataKey="sold" radius={[6, 6, 6, 6]} barSize={22}>
                {rows.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
