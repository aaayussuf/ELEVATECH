import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, AlertTriangle } from "lucide-react";

import adminDashboardService from "../../services/adminDashboardService";
import socket from "../../services/socketService";

import StatCard from "../../components/admin/dashboard/StatCard";
import SalesChart from "../../components/admin/dashboard/SalesChart";
import TopProductsChart from "../../components/admin/dashboard/TopProductsChart";
import StatusBadge from "../../components/admin/dashboard/StatusBadge";
import NotificationPanel from "../../components/admin/dashboard/NotificationPanel";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const alive = useRef(true);

  const loadDashboard = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError("");
    try {
      const [dashboardData, notificationData] = await Promise.all([
        adminDashboardService.getDashboard(),
        adminDashboardService.getNotifications().catch(() => []),
      ]);
      if (!alive.current) return;
      setDashboard({
        revenue: 0, orders: 0, customers: 0, products: 0,
        paid_orders: 0, pending_orders: 0, revenue_change_percent: 0,
        sales_chart: { labels: [], values: [] },
        top_products: [], recent_orders: [],
        ...(dashboardData || {}),
      });
      setNotifications(Array.isArray(notificationData) ? notificationData : []);
      setLastUpdated(new Date());
    } catch (err) {
      if (!alive.current) return;
      setError(
        err?.friendlyMessage ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to load dashboard."
      );
      if (!silent) setDashboard(null);
    } finally {
      if (alive.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    loadDashboard();
    const interval = setInterval(() => loadDashboard(true), 30000);
    return () => {
      alive.current = false;
      clearInterval(interval);
    };
  }, [loadDashboard]);

  useEffect(() => {
    const handler = () => loadDashboard(true);
    socket.on("notification", handler);
    return () => {
      socket.off("notification", handler);
    };
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="admin-skeleton h-9 w-64" />
          <div className="admin-skeleton mt-2 h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="admin-card p-6">
              <div className="admin-skeleton h-4 w-24" />
              <div className="admin-skeleton mt-3 h-9 w-32" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="admin-card p-6"><div className="admin-skeleton h-64 w-full" /></div>
          <div className="admin-card p-6"><div className="admin-skeleton h-64 w-full" /></div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="admin-card mx-auto max-w-xl p-8 sm:p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <AlertTriangle size={26} />
        </div>
        <h1 className="admin-page-title">Failed to load dashboard</h1>
        <p className="admin-page-sub mt-2">{error || "The server did not return dashboard data."}</p>
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-left text-xs text-slate-600">
          <p className="font-bold text-slate-700">Quick checks:</p>
          <ul className="mt-1 list-disc pl-5 space-y-1">
            <li>Is the backend running?</li>
            <li>Are you signed in as an <b>admin</b> (not customer)?</li>
            <li>Try signing out and signing in again to refresh your token.</li>
          </ul>
        </div>
        <button onClick={() => loadDashboard()} className="admin-btn admin-btn-primary mt-6 w-full">
          <RefreshCw size={16} /> Try again
        </button>
      </div>
    );
  }

  const recent = Array.isArray(dashboard.recent_orders) ? dashboard.recent_orders : [];

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-amber-600">Welcome back</p>
          <h1 className="admin-page-title">Store Overview</h1>
          <p className="admin-page-sub">
            {lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()}` : "Live data"}
            {refreshing ? " · refreshing…" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/orders/board" className="admin-btn admin-btn-ghost admin-btn-auto text-sm">Order board</Link>
          <button onClick={() => loadDashboard(true)} disabled={refreshing} className="admin-btn admin-btn-primary admin-btn-auto text-sm">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          <b>Heads up:</b> live refresh failed ({error}). Showing last good data.
        </div>
      )}

      <NotificationPanel notifications={notifications} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title="Revenue"
          value={`KSh ${Number(dashboard.revenue ?? 0).toLocaleString()}`}
          change={dashboard.revenue_change_percent}
          icon="💰"
          tone="gold"
          hint={`${dashboard.paid_orders ?? 0} paid orders`}
        />

        <StatCard
          title="Orders"
          value={Number(dashboard.orders ?? 0).toLocaleString()}
          icon="📦"
          tone="navy"
          hint={`${dashboard.pending_orders ?? 0} pending`}
        />

        <StatCard
          title="Customers"
          value={Number(dashboard.customers ?? 0).toLocaleString()}
          icon="👥"
          tone="blue"
        />

        <StatCard
          title="Products"
          value={Number(dashboard.products ?? 0).toLocaleString()}
          icon="🛒"
          tone="green"
        />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        <SalesChart data={dashboard.sales_chart} />

        <TopProductsChart products={dashboard.top_products} />

      </div>

      <div className="admin-card overflow-hidden">

        <h2 className="text-lg font-black text-slate-900 p-6 pb-0">
          Recent Orders
        </h2>

        <table className="admin-table">

          <thead>

            <tr>

              <th>Order</th>

              <th>Status</th>

              <th>Total</th>

              <th>Date</th>

            </tr>

          </thead>

          <tbody>

            {recent.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-slate-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              recent.map((order) => (
              <tr key={order.id}>

                <td>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="font-extrabold text-blue-700 hover:underline"
                  >
                    #{order.id}
                  </Link>
                </td>

                <td>
                  <StatusBadge status={order.status} />
                </td>

                <td className="font-bold">
                  KSh {Number(order.total ?? 0).toLocaleString()}
                </td>

                <td className="text-slate-500">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}
                </td>

              </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
