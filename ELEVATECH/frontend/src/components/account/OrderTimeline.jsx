export default function OrderTimeline({ order }) {
  if (!order) return null;

  const status = String(
    order.status || "Pending"
  ).toLowerCase();

  const formatDate = (date) => {
    if (!date) return null;

    return new Date(date).toLocaleString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "cancelled") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-6">

        <div className="flex items-start gap-4">

          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-xl">
            ×
          </div>

          <div>
            <h2 className="text-xl font-black text-red-700">
              Order Cancelled
            </h2>

            <p className="text-red-600 mt-1">
              This order has been cancelled.
            </p>

            {order.created_at && (
              <p className="text-sm text-red-500 mt-2">
                Order placed:{" "}
                {formatDate(order.created_at)}
              </p>
            )}
          </div>

        </div>

      </div>
    );
  }

  const steps = [
    {
      key: "pending",
      label: "Order Placed",
      description:
        "Your order has been received.",
      date: order.created_at,
    },
    {
      key: "processing",
      label: "Processing",
      description:
        "Your order is being prepared.",
      date: null,
    },
    {
      key: "paid",
      label: "Payment Confirmed",
      description:
        "Your payment has been confirmed.",
      date: null,
    },
    {
      key: "shipped",
      label: "Shipped",
      description:
        "Your order is on its way.",
      date: order.shipped_at,
    },
    {
      key: "delivered",
      label: "Delivered",
      description:
        "Your order has been delivered.",
      date: order.delivered_at,
    },
  ];

  const currentIndex = steps.findIndex(
    (step) => step.key === status
  );

  const activeIndex =
    currentIndex === -1
      ? 0
      : currentIndex;

  return (
    <div className="bg-white border rounded-3xl p-6">

      <h2 className="text-2xl font-black mb-6">
        Order Progress
      </h2>

      <div className="space-y-6">

        {steps.map((step, index) => {

          const completed =
            index <= activeIndex;

          const current =
            index === activeIndex;

          return (
            <div
              key={step.key}
              className="flex gap-4"
            >

              <div className="flex flex-col items-center">

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                    completed
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {completed
                    ? "✓"
                    : index + 1}
                </div>

                {index <
                  steps.length - 1 && (
                  <div
                    className={`w-1 h-10 mt-1 ${
                      index < activeIndex
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}

              </div>

              <div className="pb-2">

                <h3
                  className={`font-bold ${
                    current
                      ? "text-blue-600"
                      : completed
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </h3>

                <p
                  className={`text-sm mt-1 ${
                    completed
                      ? "text-gray-500"
                      : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>

                {step.date && (
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(step.date)}
                  </p>
                )}

                {current && (
                  <span className="inline-block mt-2 text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                    Current Status
                  </span>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
