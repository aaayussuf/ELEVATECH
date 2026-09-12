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
    <div className="space-y-4">
      {/* DELIVERY */}
      <div className="pdp-card pdp-card-hover p-5">
        <Heading>Delivery &amp; pickup</Heading>

        <p className="mt-3 flex items-start gap-2 text-sm">
          <MapPinned size={17} className="text-emerald-600 shrink-0" />
          <span className="font-semibold text-[#0F1111]">
            FREE delivery to your door
          </span>
        </p>

        <DeliveryEstimate inStock={inStock} compact />

        <p className="mt-2.5 flex items-center gap-2 text-sm text-[#0F1111]">
          <RotateCcw size={16} className="text-blue-600" />
          Easy returns
        </p>
      </div>

      {/* PAYMENTS */}
      <div className="pdp-card pdp-card-hover p-5">
        <Heading>Secure payments</Heading>

        <div className="mt-3 flex flex-wrap gap-2">
          {PAYMENTS.map((payment) => (
            <span
              key={payment.label}
              className={`px-3 py-1 rounded-full text-xs font-bold ${payment.badge}`}
            >
              {payment.label}
            </span>
          ))}
        </div>

        <p className="mt-2 text-xs flex items-start gap-1.5 text-[#565959]">
          <Lock size={13} className="shrink-0 text-emerald-600" />
          Your payment details are encrypted and protected.
        </p>
      </div>

      {/* AUTHENTICITY */}
      <div className="pdp-card pdp-card-hover p-5">
        <Heading>Trusted quality</Heading>

        <ul className="mt-3 space-y-2.5 text-sm">
          <li className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            100% genuine products
          </li>

          <li className="flex items-center gap-2">
            <PackageCheck size={16} className="text-blue-600 shrink-0" />
            Sourced from trusted distributors
          </li>

          {warranty && (
            <li className="flex items-center gap-2">
              <CircleCheckBig
                size={16}
                className="text-emerald-600 shrink-0"
              />
              Warranty: {warranty}
            </li>
          )}
        </ul>
      </div>

      {/* SELLER */}
      <div className="pdp-card pdp-card-hover p-5">
        <Heading>Sold by</Heading>

        <p className="mt-2 font-bold flex items-center gap-2 text-[#0F1111]">
          ELEVATECH

          <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
            <CircleCheckBig size={11} />
            Verified seller
          </span>
        </p>

        {product.sku && (
          <p className="mt-1 text-xs text-[#565959]">SKU: {product.sku}</p>
        )}

        {product.barcode && (
          <p className="mt-1 text-xs text-[#565959]">
            Barcode: {product.barcode}
          </p>
        )}
      </div>

      {/* SUPPORT */}
      <div className="pdp-card pdp-card-hover p-5">
        <Heading className="flex items-center gap-2">
          <Info size={15} /> Questions about this item?
        </Heading>

        <p className="mt-2 text-sm text-[#565959]">
          See our{" "}
          <a href="#faq" className="pdp-link">
            store FAQ
          </a>{" "}
          for delivery, returns, warranty and payment details.
        </p>
      </div>
    </div>
  );
}