import {
  CircleCheckBig,
  Info,
  Lock,
  MapPinned,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import DeliveryEstimate from "./DeliveryEstimate";

const PAYMENTS = [
  { label: "M-Pesa", badge: "bg-emerald-50 text-emerald-800" },
  { label: "Visa", badge: "bg-blue-50 text-blue-800" },
  { label: "Mastercard", badge: "bg-violet-50 text-violet-800" },
  { label: "Stripe", badge: "bg-slate-50 text-slate-700" },
];

function Heading({ children }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-wide text-[#565959]">
      {children}
    </h3>
  );
}

export default function TrustSidebar({ product }) {
  const stock = Number(product.quantity || 0);
  const inStock = stock > 0;
  const warranty = product.warranty;

  return (
    <aside className="w-full min-w-0 space-y-3 sm:space-y-4">
      {/* DELIVERY */}
      <div className="pdp-card pdp-card-hover p-4 sm:p-5">
        <Heading>Delivery &amp; pickup</Heading>

        <p className="mt-3 flex items-start gap-2 text-sm leading-5">
          <MapPinned
            size={17}
            className="mt-0.5 shrink-0 text-emerald-600"
          />

          <span className="font-semibold text-[#0F1111]">
            FREE delivery to your door
          </span>
        </p>

        <div className="mt-2">
          <DeliveryEstimate inStock={inStock} compact />
        </div>

        <p className="mt-3 flex items-center gap-2 text-sm text-[#0F1111]">
          <RotateCcw
            size={16}
            className="shrink-0 text-blue-600"
          />

          <span>Easy returns</span>
        </p>
      </div>

      {/* PAYMENTS */}
      <div className="pdp-card pdp-card-hover p-4 sm:p-5">
        <Heading>Secure payments</Heading>

        <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
          {PAYMENTS.map((payment) => (
            <span
              key={payment.label}
              className={`rounded-full px-2.5 py-1 text-[11px] sm:px-3 sm:text-xs font-bold whitespace-nowrap ${payment.badge}`}
            >
              {payment.label}
            </span>
          ))}
        </div>

        <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-[#565959]">
          <Lock
            size={13}
            className="mt-0.5 shrink-0 text-emerald-600"
          />

          <span>
            Your payment details are encrypted and protected.
          </span>
        </p>
      </div>

      {/* AUTHENTICITY */}
      <div className="pdp-card pdp-card-hover p-4 sm:p-5">
        <Heading>Trusted quality</Heading>

        <ul className="mt-3 space-y-3 text-sm leading-5">
          <li className="flex items-start gap-2">
            <ShieldCheck
              size={16}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <span>100% genuine products</span>
          </li>

          <li className="flex items-start gap-2">
            <PackageCheck
              size={16}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <span>Sourced from trusted distributors</span>
          </li>

          {warranty && (
            <li className="flex items-start gap-2">
              <CircleCheckBig
                size={16}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <span className="min-w-0">
                Warranty: {warranty}
              </span>
            </li>
          )}
        </ul>
      </div>

      {/* SELLER */}
      <div className="pdp-card pdp-card-hover p-4 sm:p-5">
        <Heading>Sold by</Heading>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="font-bold text-[#0F1111]">
            ELEVATECH
          </p>

          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] sm:text-[11px] font-semibold text-emerald-800">
            <CircleCheckBig size={11} />
            Verified seller
          </span>
        </div>

        {product.sku && (
          <p className="mt-2 break-all text-xs leading-5 text-[#565959]">
            SKU: {product.sku}
          </p>
        )}

        {product.barcode && (
          <p className="mt-1 break-all text-xs leading-5 text-[#565959]">
            Barcode: {product.barcode}
          </p>
        )}
      </div>

      {/* SUPPORT */}
      <div className="pdp-card pdp-card-hover p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Info
            size={15}
            className="shrink-0 text-[#565959]"
          />

          <Heading>Questions about this item?</Heading>
        </div>

        <p className="mt-2 text-sm leading-6 text-[#565959]">
          See our{" "}
          <a href="#faq" className="pdp-link">
            store FAQ
          </a>{" "}
          for delivery, returns, warranty and payment details.
        </p>
      </div>
    </aside>
  );
}
