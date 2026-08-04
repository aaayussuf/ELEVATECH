import "./OrderDetails.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminOrderService from "../../../services/adminOrderService";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courier, setCourier] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    try {
      const data = await adminOrderService.getOrder(id);

      setOrder(data);

      setStatus(data.status || "");
      setPaymentStatus(data.payment_status || "");
      setTrackingNumber(data.tracking_number || "");
      setCourier(data.courier || "");
      setNotes(data.notes || "");
    } finally {
      setLoading(false);
    }
  }

  async function saveChanges() {
    await adminOrderService.updateOrder(id, {
      status,
      payment_status: paymentStatus,
      tracking_number: trackingNumber,
      courier,
      notes,
    });

    alert("Order updated successfully");

    loadOrder();
  }

  if (loading) return <p>Loading...</p>;

  if (!order) return <p>Order not found.</p>;

return (
    <div className="page">

      <div className="page-header">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div>
          <h2>Order #{order.id}</h2>

          <span
            className={`badge ${status.toLowerCase()}`}
          >
            {status}
          </span>
        </div>

      </div>

      <div className="order-grid">

        {/* LEFT COLUMN */}

        <div>

          <div className="card">

            <h3>Customer</h3>

            <div className="info-row">
              <strong>Name</strong>
              <span>{order.customer.name}</span>
            </div>

            <div className="info-row">
              <strong>Email</strong>
              <span>{order.customer.email}</span>
            </div>

            <div className="info-row">
              <strong>Phone</strong>
              <span>{order.customer.phone}</span>
            </div>

          </div>

          <br />

          <div className="card">

            <h3>Products</h3>

            <table className="table">

              <thead>

                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>

              </thead>

              <tbody>

                {order.items.map(item => (

                  <tr key={item.id}>

                    <td>{item.product_name}</td>

                    <td>{item.quantity}</td>

                    <td>${item.price}</td>

                    <td>${item.subtotal}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* RIGHT COLUMN */}

        <div>

          <div className="card">

            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Coupon</span>
              <strong>{order.coupon_code || "-"}</strong>
            </div>

            <div className="summary-row">
              <span>Discount</span>
              <strong>${order.discount || 0}</strong>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${order.total}</span>
            </div>

          </div>

          <br />

          <div className="card">

            <h3>Order Management</h3>

            <div className="form-group">

              <label>Order Status</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option>Pending</option>
                <option>Processing</option>
                <option>Paid</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>

            </div>

            <div className="form-group">

              <label>Payment Status</label>

              <select
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(e.target.value)
                }
              >
                <option>Pending</option>
                <option>Paid</option>
                <option>Failed</option>
                <option>Refunded</option>
              </select>

            </div>

            <div className="form-group">

              <label>Courier</label>

              <input
                value={courier}
                onChange={(e) =>
                  setCourier(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>Tracking Number</label>

              <input
                value={trackingNumber}
                onChange={(e) =>
                  setTrackingNumber(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>Notes</label>

              <textarea
                rows={5}
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
              />

            </div>

            <button
              className="save-btn"
              onClick={saveChanges}
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
