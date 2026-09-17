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

export default function DeliveryEstimate({
  inStock = true,
  compact = false,
}) {
  if (!inStock) {
    return null;
  }

  const today = new Date();
  const earliest = addBusinessDays(today, 2);
  const latest = addBusinessDays(today, 4);

  const earliestLabel = formatEstimate(earliest);
  const latestLabel = formatEstimate(latest);

  if (compact) {
    return (
      <p className="mt-2 min-w-0 break-words text-xs leading-5 text-[#0F1111] sm:mt-3 sm:text-sm">
        FREE Delivery · Est.{" "}
        <span className="font-semibold">{latestLabel}</span>
      </p>
    );
  }

  return (
    <div className="w-full min-w-0 text-sm sm:text-base">
      <p className="font-semibold leading-5 text-emerald-700 sm:leading-6">
        FREE Delivery
      </p>

      <p className="mt-1 min-w-0 break-words leading-6 text-[#0F1111]">
        Get it by{" "}
        <span className="font-bold">
          {earliestLabel === latestLabel
            ? latestLabel
            : `${earliestLabel} – ${latestLabel}`}
        </span>
      </p>

      <p className="mt-1 min-w-0 break-words text-xs leading-5 text-[#565959]">
        Estimated · Nairobi 1–2 days · Nationwide 2–4 days
      </p>
    </div>
  );
}