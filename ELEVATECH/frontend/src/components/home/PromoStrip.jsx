import {
  BadgeCheck,
  Headphones,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";

const messages = [
  {
    icon: Truck,
    text: "Kenya-wide delivery",
  },
  {
    icon: ShieldCheck,
    text: "Secure M-Pesa & card payments",
  },
  {
    icon: BadgeCheck,
    text: "100% genuine products",
  },
  {
    icon: Zap,
    text: "Officially sealed devices",
  },
  {
    icon: Headphones,
    text: "Expert help choosing tech",
  },
];

export default function PromoStrip() {
  const items = [...messages, ...messages];

  return (
    <div className="bg-[#0A1423] border-y border-white/5 overflow-hidden py-2.5">
      <div className="flex w-full animate-marquee" aria-hidden="true">
        {items.map(({ icon: Icon, text }, index) => (
          <span
            key={index}
            className="mx-8 inline-flex shrink-0 items-center gap-2 text-[11px] sm:text-xs font-bold text-slate-300 whitespace-nowrap"
          >
            <Icon size={14} className="text-yellow-400" />
            {text}
            <span className="text-slate-600">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}