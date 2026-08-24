import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import AccountLayout from "../../layouts/AccountLayout";
import accountService from "../../services/accountService";

export default function OrderDetails() {

  const {
    user,
    token,
    isLoading: authLoading,
    logout,
  } = useContext(AuthContext);

  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!authLoading && !token) {
      navigate("/login");
      return;
    }

    if (!authLoading && token) {
      let isMounted = true;

      const loadOrder = async () => {

        try {

          setLoading(true);
          setError("");

          const data =
            await accountService.getOrderDetails(
              token,
              id
            );

          if (isMounted) {
            setOrder(data);
          }

        } catch (err) {

          console.error(
            "Load order details error:",
            err
          );

          if (isMounted) {
            setError(
              err?.response?.data?.message ||
              err?.message ||
              "Unable to load order."
            );
          }

        } finally {

          if (isMounted) {
            setLoading(false);
          }

        }
      };

      loadOrder();

      return () => {
        isMounted = false;
      };
    }

  }, [authLoading, token, id, navigate]);


  if (authLoading || loading) {

    return (
      <AccountLayout
        user={user}
        onLogout={logout}
      >
        <div className="p-8 text-center">
          Loading order...
        </div>
      </AccountLayout>
    );

  }


  if (error || !order) {

    return (
      <AccountLayout
        user={user}
        onLogout={logout}
      >

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

          <h2 className="text-xl font-bold text-red-700">
            Order not found
          </h2>

          <p className="text-red-600 mt-2">
            {error || "This order could not be found."}
          </p>

          <Link
            to="/account/orders"
            className="inline-block mt-5 bg-gray-900 text-white px-5 py-3 rounded-xl font-bold"
          >
            Back to Orders
          </Link>

        </div>

      </AccountLayout>
    );

  }


  const items = order.items || [];


  return (

    <AccountLayout
      user={user}
      onLogout={logout}
    >

      <div className="space-y-8">

        <Link
          to="/account/orders"
          className="text-blue-600 hover:underline font-semibold"
        >
          ← Back to Orders
        </Link>


        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <p className="text-gray-500">
              Order
            </p>

            <h1 className="text-4xl font-black">
              #{order.id}
            </h1>

            <p className="text-gray-500 mt-2">
              {order.created_at
                ? new Date(
                    order.created_at
                  ).toLocaleString()
                : "Date unavailable"}
            </p>

          </div>


          <div className="flex flex-wrap gap-3">

            <span className="px-5 py-2 rounded-full bg-blue-50 text-blue-700 font-bold">
              {order.status || "Pending"}
            </span>

            <span
              className={`px-5 py-2 rounded-full font-bold ${
                order.payment_status === "Paid"
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {order.payment_status ||
                "Payment Pending"}
            </span>

          </div>

        </div>


        {/* SUMMARY */}

        <div className="grid md:grid-cols-3 gap-5">

          <div className="bg-white border rounded-2xl p-5">

            <p className="text-sm text-gray-500">
              Payment Method
            </p>

            <p className="font-bold mt-2">
              {order.payment_method || "—"}
            </p>

          </div>


          <div className="bg-white border rounded-2xl p-5">

            <p className="text-sm text-gray-500">
              Items
            </p>

            <p className="font-bold text-xl mt-2">
              {items.reduce(
                (sum, item) =>
                  sum +
                  Number(item.quantity || 0),
                0
              )}
            </p>

          </div>


          <div className="bg-white border rounded-2xl p-5">

            <p className="text-sm text-gray-500">
              Order Total
            </p>

            <p className="font-black text-2xl text-blue-600 mt-2">
              KSh{" "}
              {Number(
                order.total || 0
              ).toLocaleString()}
            </p>

          </div>

        </div>


        {/* ITEMS */}

        <div className="bg-white border rounded-3xl overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-black">
              Order Items
            </h2>

          </div>


          <div className="divide-y">

            {items.length === 0 ? (

              <div className="p-8 text-gray-500">
                No items found.
              </div>

            ) : (

              items.map((item) => (

                <div
                  key={item.id}
                  className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
                >

                  <div>

                    <h3 className="font-bold text-lg">
                      {item.product_name ||
                        `Product #${item.product_id}`}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      Quantity: {item.quantity}
                    </p>

                    <p className="text-gray-500">
                      Unit price: KSh{" "}
                      {Number(
                        item.price || 0
                      ).toLocaleString()}
                    </p>

                  </div>


                  <div className="font-black text-lg">
                    KSh{" "}
                    {Number(
                      item.subtotal ??
                      Number(item.price || 0) *
                      Number(item.quantity || 0)
                    ).toLocaleString()}
                  </div>

                </div>

              ))

            )}

          </div>

        </div>


        {/* ORDER INFORMATION */}

        <div className="bg-gray-50 rounded-3xl p-6">

          <h2 className="text-xl font-black mb-5">
            Order Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <p className="text-sm text-gray-500">
                Order Status
              </p>

              <p className="font-bold mt-1">
                {order.status || "—"}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Payment Status
              </p>

              <p className="font-bold mt-1">
                {order.payment_status || "—"}
              </p>

            </div>


            {order.tracking_number && (

              <div>

                <p className="text-sm text-gray-500">
                  Tracking Number
                </p>

                <p className="font-bold mt-1">
                  {order.tracking_number}
                </p>

              </div>

            )}


            {order.courier && (

              <div>

                <p className="text-sm text-gray-500">
                  Courier
                </p>

                <p className="font-bold mt-1">
                  {order.courier}
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </AccountLayout>

  );
}