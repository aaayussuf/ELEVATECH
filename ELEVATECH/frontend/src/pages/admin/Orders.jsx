import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminOrderService from "../../services/adminOrderService";
import DataTable from "../../components/admin/tables/DataTable";
import StatusBadge from "../../components/admin/tables/StatusBadge";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await adminOrderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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
      render: (order) => <StatusBadge status={order.status} />,
    },
    {
      key: "total",
      title: "Total",
      render: (order) =>
        `KSh ${Number(order.total).toLocaleString()}`,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        actions={(order) => (
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate(`/admin/orders/${order.id}`)}
          >
            View
          </button>
        )}
      />
    </div>
  );
}
