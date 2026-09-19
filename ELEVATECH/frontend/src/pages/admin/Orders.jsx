import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Eye } from "lucide-react";
import adminOrderService from "../../services/adminOrderService";
import DataTable from "../../components/admin/tables/DataTable";
import StatusBadge from "../../components/admin/dashboard/StatusBadge";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");
      const data = await adminOrderService.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.friendlyMessage || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

   
  useEffect(() => {
    loadOrders();
  }, []);

  const columns = [
    {
      key: "id",
      title: "Order",
      render: (order) => `#${order.id}`,
    },
    {
      key: "payment_method",
      title: "Payment",
    },
{
      key: "status",
      title: "Status",
      render: (order) => (
        <span className="flex flex-col gap-1.5">
          <StatusBadge status={order.status} />
          <select
            className="admin-select max-w-[150px]"
            value={order.status}
          onChange={async (e) => {
            const status = e.target.value;

            try {
              await adminOrderService.updateOrder(order.id, {
                status,
              });

              setOrders((prev) =>
                prev.map((o) =>
                  o.id === order.id
                    ? { ...o, status }
                    : o
                )
              );
            } catch {
              alert("Failed to update order.");
            }
          }}
        >
          <option>Pending</option>
          <option>Processing</option>
          <option>Paid</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
        </span>
      ),
    },
    {
      key: "total",
      title: "Total",
      render: (order) =>
        `KSh ${Number(order.total ?? 0).toLocaleString()}`,
    },
  ];

  const visible = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-amber-600">Sales · Fulfilment</p>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-sub">{orders.length} total · {visible.length} shown</p>
        </div>
        <button onClick={loadOrders} className="admin-btn admin-btn-ghost admin-btn-auto text-sm">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Processing", "Paid", "Shipped", "Delivered", "Cancelled"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${filter === s ? "bg-slate-900 text-amber-300" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"}`}>{s}</button>
        ))}
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <DataTable
        columns={columns}
        data={visible}
        loading={loading}
        emptyMessage={filter === "All" ? "No orders yet." : `No ${filter} orders.`}
        actions={(order) => (
          <button
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700"
            onClick={() => navigate(`/admin/orders/${order.id}`)}
          >
            <Eye size={14} /> View
          </button>
        )}
      />
    </div>
  );
}
