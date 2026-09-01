import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import adminOrderService from "../../services/adminOrderService";

export default function Orders() {
  const [orders, setOrders] = useState([]);


  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  const loadOrders = useCallback(async () => {
    try {
      const data = await adminOrderService.getOrders();

      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
     
    loadOrders();
  }, [loadOrders]);

  const filtered = useMemo(() => {
    let result = [...orders];

    if (search) {
      const s = search.toLowerCase();

      result = result.filter((o) => {
        return (
          String(o.id).includes(s) ||
          (o.customer?.name || "").toLowerCase().includes(s) ||
          (o.customer?.email || "").toLowerCase().includes(s)
        );
      });
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (o) => o.status === statusFilter
      );
    }

    if (paymentFilter !== "All") {
      result = result.filter(
        (o) => o.payment_method === paymentFilter
      );
    }

    return result;
  }, [orders, search, statusFilter, paymentFilter]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === "Pending").length,
      delivered: orders.filter(o => o.status === "Delivered").length,
      revenue: orders.reduce((sum, o) => sum + Number(o.total), 0)
    };
  }, [orders]);


  if (loading)
    return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 30 }}>

      <h1>Orders</h1>

      <br />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 15
        }}
      >
        <Card title="Total Orders" value={stats.total} />
        <Card title="Pending" value={stats.pending} />
        <Card title="Delivered" value={stats.delivered} />
        <Card
          title="Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
        />
      </div>

      <br />

      <div
        style={{
          display: "flex",
          gap: 15
        }}
      >
        <input
          placeholder="Search orders..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option>All</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Paid</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) =>
            setPaymentFilter(e.target.value)
          }
        >
          <option>All</option>
          <option>Stripe</option>
          <option>Mpesa</option>
        </select>
      </div>

      <br />

      <table
        width="100%"
        cellPadding="10"
        border="1"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>

              <td>
                {order.customer?.name}
                <br />
                <small>
                  {order.customer?.email}
                </small>
</td>

              <td>
                <select
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
                    } catch (err) {
                      console.error(err);
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
              </td>

              <td>{order.payment_method}</td>

              <td>
                ${Number(order.total).toFixed(2)}
              </td>

              <td>
                {new Date(
                  order.created_at
                ).toLocaleDateString()}
              </td>

              <td>
                <Link
                  to={`/admin/orders/${order.id}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!filtered.length && (
        <h3>No orders found.</h3>
      )}

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,.08)"
      }}
    >
      <h4>{title}</h4>

      <h2>{value}</h2>
    </div>
  );
}