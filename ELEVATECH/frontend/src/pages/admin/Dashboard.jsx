import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import StatCard from "../../components/admin/cards/StatCard";
import DashboardCard from "../../components/admin/cards/DashboardCard";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/api/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Navigation */}
      <div className="flex gap-4 mb-6">
        <Link
          to="/admin"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/customers"
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm"
        >
          Customers
        </Link>
        <Link
          to="/admin/products"
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm"
        >
          Manage Products
        </Link>
        <Link
          to="/admin/products/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          + Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Revenue"
          value={`KSh ${stats.revenue.toLocaleString()}`}
          subtitle="Total sales"
          icon="💰"
          color="green"
        />

        <StatCard
          title="Orders"
          value={stats.total_orders}
          subtitle="Total orders"
          icon="📦"
          color="blue"
        />

        <StatCard
          title="Customers"
          value={stats.customers}
          subtitle="Registered users"
          icon="👥"
          color="purple"
        />

        <StatCard
          title="Products"
          value={stats.products}
          subtitle="In catalog"
          icon="🛍️"
          color="yellow"
        />
      </div>

      <DashboardCard title="Recent Orders">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Order</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent_orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-2">#{order.id}</td>
                <td className="py-2">{order.status}</td>
                <td className="py-2">KSh {order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardCard>
    </div>
  );
}

