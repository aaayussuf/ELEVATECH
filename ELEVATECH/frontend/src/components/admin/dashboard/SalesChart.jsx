import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";

export default function SalesChart({ data }) {
  const chartData =
    data?.labels?.map((label, index) => ({
      day: label,
      sales: Number(data.values?.[index] ?? 0),
    })) || [];

  const hasData = chartData.some((d) => d.sales > 0);

  return (
    <div className="admin-card p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            Revenue · Last 7 Days
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paid orders only · auto-refreshes every 30s
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${hasData ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {hasData ? "● Live" : "○ No sales yet"}
        </span>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ left: -12, right: 12, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="adminSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5b301" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#f5b301" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} />
            <Tooltip
              formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, "Revenue"]}
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
            />
            <Area type="monotone" dataKey="sales" stroke="none" fill="url(#adminSales)" />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#0b1526"
              strokeWidth={3}
              dot={{ r: 4, fill: "#f5b301", stroke: "#0b1526", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
