import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import adminDashboardService from "../../services/adminDashboardService";

import StatCard from "../../components/admin/dashboard/StatCard";
import SalesChart from "../../components/admin/dashboard/SalesChart";
import TopProductsChart from "../../components/admin/dashboard/TopProductsChart";
import StatusBadge from "../../components/admin/dashboard/StatusBadge";
import NotificationPanel from "../../components/admin/dashboard/NotificationPanel";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadDashboard() {
    try {
      const [dashboardData, notificationData] =
        await Promise.all([
          adminDashboardService.getDashboard(),
          adminDashboardService.getNotifications(),
        ]);

      setDashboard(dashboardData);
      setNotifications(notificationData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <p className="text-sm text-gray-500">
        Last updated:
        {" "}
        {lastUpdated?.toLocaleTimeString()}
      </p>

      <NotificationPanel
        notifications={notifications}
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Revenue"
          value={`KSh ${Number(dashboard.revenue).toLocaleString()}`}
          change={dashboard.revenue_change_percent}
          icon="💰"
        />

        <StatCard
          title="Orders"
          value={dashboard.orders}
          icon="📦"
        />

        <StatCard
          title="Customers"
          value={dashboard.customers}
          icon="👥"
        />

        <StatCard
          title="Products"
          value={dashboard.products}
          icon="🛒"
        />

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <SalesChart
          data={dashboard.sales_chart}
        />

        <TopProductsChart
          products={dashboard.top_products}
        />

      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border p-6">

        <h2 className="text-xl font-semibold mb-4">
          Recent Orders
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">Order</th>

              <th className="text-left py-3">Status</th>

              <th className="text-left py-3">Total</th>

              <th className="text-left py-3">Date</th>

            </tr>

          </thead>

          <tbody>

            {dashboard.recent_orders.map(order => (

              <tr
                key={order.id}
                className="border-b"
>

                <td className="py-3">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    #{order.id}
                  </Link>
                </td>

                <td className="py-3">
                  <StatusBadge status={order.status} />
                </td>

                <td className="py-3">
                  KSh {Number(order.total).toLocaleString()}
                </td>

                <td className="py-3">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
