import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-2xl font-bold">KSh {stats.revenue}</h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Orders</p>
          <h2 className="text-2xl font-bold">{stats.total_orders}</h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Customers</p>
          <h2 className="text-2xl font-bold">{stats.customers}</h2>
        </div>

        <Link
          to="/admin/products"
          className="bg-white shadow rounded p-4 hover:shadow-lg transition block"
        >
          <p className="text-gray-500">Products</p>
          <h2 className="text-2xl font-bold">{stats.products}</h2>
          <p className="text-blue-600 text-sm mt-1">Manage →</p>
        </Link>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

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
      </div>
    </div>
  );
}

