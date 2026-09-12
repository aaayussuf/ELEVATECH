/* Honest delivery estimate based on the store's published
   delivery windows: Nairobi 1-2 days, nationwide 2-4 days.

   Dates are CALENDAR estimates (business days, labeled
   "estimated") - never a fake promise. */

function addBusinessDays(start, days) {
  const date = new Date(start);
  let added = 0;

  while (added < days) {
    date.setDate(date.getDate() + 1);
    const weekday = date.getDay();

    if (weekday === 0 || weekday === 6) {
      continue;
    }

    added += 1;
  }

  return date;
}

function formatEstimate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function DeliveryEstimate({ inStock = true, compact = false }) {
  if (!inStock) {
    return null;
  }

  const today = new Date();
  const earliest = addBusinessDays(today, 2);
  const latest = addBusinessDays(today, 4);

  if (compact) {
    return (
      <p className="text-sm text-[#0F1111] mt-3">
        FREE Delivery · Est.{" "}
        <span className="font-semibold">{formatEstimate(latest)}</span>
      </p>
    );
  }

  return (
    <div className="text-base">
      <p className="font-semibold text-emerald-700">FREE Delivery</p>

      <p className="mt-1 text-[#0F1111]">
        Get it by{" "}
        <span className="font-bold">
          {formatEstimate(earliest) === formatEstimate(latest)
            ? formatEstimate(latest)
            : `${formatEstimate(earliest)} – ${formatEstimate(latest)}`}
        </span>
      </p>

      <p className="text-xs text-[#565959] mt-1">
        Estimated · Nairobi 1–2 days · Nationwide 2–4 days
      </p>
    </div>
  );
}