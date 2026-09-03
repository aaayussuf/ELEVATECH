import { Link } from "react-router-dom";
import { ChevronRight, PackageCheck } from "lucide-react";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
  paid: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function OrderCard({ order, basePath = "/account/orders" }) {
  if (!order) return null;

  const key = String(order.status || "").toLowerCase();
  const pill = statusStyles[key] || statusStyles.pending;

  return (
    <div className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
            Order
          </p>
          <p className="mt-0.5 text-lg font-black text-gray-900">
            #{order.id}
          </p>
        </div>

        {order.status && (
          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-black ${pill}`}
          >
            {order.status}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-yellow-400 text-black">
          <PackageCheck size={19} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">Order total</p>
          <p className="font-black text-gray-900">
            KSh {Number(order.total).toLocaleString()}
          </p>
        </div>
      </div>

      <Link
        to={`${basePath}/${order.id}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-black text-blue-600 transition group-hover:gap-2 hover:text-blue-700"
      >
        View details
        <ChevronRight size={15} />
      </Link>
    </div>
  );
}

