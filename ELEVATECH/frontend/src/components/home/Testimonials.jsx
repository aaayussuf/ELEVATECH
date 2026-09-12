import {
  BadgeCheck,
  Quote,
  Star,
} from "lucide-react";

const testimonials = [
  {
    name: "Brian Ochieng",
    location: "Nairobi",
    role: "Ordered a Dell XPS 15",
    quote:
      "The laptop was exactly as described, sealed and delivered in two days. Their team even followed up to make sure everything was set up fine.",
  },
  {
    name: "Amina Hassan",
    location: "Mombasa",
    role: "Ordered an iPhone 17",
    quote:
      "Genuine product with receipt and warranty — not the refurbished units you find elsewhere. M-Pesa checkout was quick and stress-free.",
  },
  {
    name: "Kevin Mwangi",
    location: "Kisumu",
    role: "Business purchase — 6 HP printers",
    quote:
      "We outfit our whole office through ELEVATECH. Reliable stock, fair pricing and proper invoicing for our business records.",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#07101D] py-10 sm:py-14">
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-yellow-400/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-blue-400">
              <BadgeCheck size={14} />
              Trusted across Kenya
            </p>

            <h2 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">
              Customers who love
              <span className="text-yellow-400"> ELEVATECH.</span>
            </h2>

            <p className="mt-3 max-w-xl text-slate-400">
              Real feedback from people who shop with us every day.
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-400/25 bg-[#0B1628] px-5 py-4 shadow-xl">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={16}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}

              <span className="ml-1.5 text-lg font-black text-white">
                4.9/5
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Average from 2,300+ verified reviews
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map(({ name, location, role, quote }) => (
            <div
              key={name}
              className="relative flex flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-[#101C31] to-[#091321] p-7 hover:border-blue-400/40 transition"
            >
              <Quote
                size={26}
                className="absolute top-5 right-6 text-blue-400/40"
              />

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={15}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-300">
                &ldquo;{quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="w-11 h-11 shrink-0 rounded-full bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-sm font-black text-yellow-400">
                  {name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    {name}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    {role} &middot; {location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}