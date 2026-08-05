import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function TopProductsChart({ products }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">

      <h2 className="text-xl font-semibold mb-4">
        Best Selling Products
      </h2>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>

          <BarChart data={products || []} layout="vertical">

            <XAxis type="number" />

            <YAxis
              type="category"
              dataKey="name"
              width={120}
            />

            <Tooltip />

            <Bar
              dataKey="sold"
              radius={[4, 4, 4, 4]}
            />

          </BarChart>

        </ResponsiveContainer>
      </div>

    </div>
  );
}
