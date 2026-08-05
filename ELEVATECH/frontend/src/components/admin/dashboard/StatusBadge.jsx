export default function StatusBadge({ status }) {
  switch (status) {
    case "Pending":
      return (
        <span className="inline-flex rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-xs font-semibold">
          Pending
        </span>
      );

    case "Processing":
      return (
        <span className="inline-flex rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-semibold">
          Processing
        </span>
      );

    case "Paid":
      return (
        <span className="inline-flex rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold">
          Paid
        </span>
      );

    case "Shipped":
      return (
        <span className="inline-flex rounded-full bg-purple-100 text-purple-800 px-3 py-1 text-xs font-semibold">
          Shipped
        </span>
      );

    case "Delivered":
      return (
        <span className="inline-flex rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold">
          Delivered
        </span>
      );

    case "Cancelled":
      return (
        <span className="inline-flex rounded-full bg-red-100 text-red-800 px-3 py-1 text-xs font-semibold">
          Cancelled
        </span>
      );

    default:
      return (
        <span className="inline-flex rounded-full bg-gray-100 text-gray-800 px-3 py-1 text-xs font-semibold">
          {status}
        </span>
      );
  }
}