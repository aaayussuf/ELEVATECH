import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Star, Truck, Users } from "lucide-react";

const stats = [
  { icon: Users, value: 8500, suffix: "+", label: "Happy customers across Kenya", decimals: 0 },
  { icon: Star, value: 4.9, suffix: "/5", label: "Average from 2,300+ verified reviews", decimals: 1 },
  { icon: ShieldCheck, value: 100, suffix: "%", label: "Genuine, sealed products with warranty", decimals: 0 },
  { icon: Truck, value: 47, suffix: "", label: "Counties served with tracked delivery", decimals: 0 },
];

function StatCard({ icon: Icon, value, suffix, label, decimals }) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let raf;
    const start = performance.now();
    const duration = 1600;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value]);

  return (
    <div
      ref={ref}
      className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#101C31] to-[#0A1322] p-5 sm:p-6 text-center hover:border-yellow-400/30 hover:-translate-y-1 transition duration-300"
    >
      <div className="mx-auto w-11 h-11 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
        <Icon size={20} className="text-yellow-400" />
      </div>
      <p className="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">
        {Number(display).toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        <span className="text-yellow-400">{suffix}</span>
      </p>
      <p className="mt-1.5 text-xs sm:text-sm leading-5 text-slate-400">{label}</p>
    </div>
  );
}

export default function TrustStats() {
  return (
    <section className="bg-[#07101D] pb-2 pt-10" aria-label="ELEVATECH trust statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
