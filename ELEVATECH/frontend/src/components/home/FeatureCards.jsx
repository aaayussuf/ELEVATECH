import {
  Truck,
  ShieldCheck,
  BadgeCheck,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Authentic products",
    description:
      "Quality technology from trusted brands, with product and warranty details.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    description:
      "Shop confidently with protected checkout and trusted payment options.",
  },
  {
    icon: Truck,
    title: "Reliable delivery",
    description:
      "Professional delivery service for customers across Kenya.",
  },
  {
    icon: Headphones,
    title: "Human support",
    description:
      "Get help choosing the right technology before and after you buy.",
  },
];

export default function FeatureCards() {
  return (
    <section className="relative z-10 -mt-1 bg-[#07101D]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 rounded-3xl border border-white/10 bg-[#0B1628] overflow-hidden shadow-2xl shadow-black/20">

          {features.map(
            ({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className={`p-6 sm:p-7 ${
                  index
                    ? "border-t md:border-t-0 md:border-l border-white/10"
                    : ""
                }`}
              >

                <div className="flex gap-4">

                  <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-500/10 border border-blue-400/15 flex items-center justify-center">

                    <Icon
                      size={21}
                      className="text-blue-300"
                    />

                  </div>

                  <div>

                    <h3 className="font-bold text-white">
                      {title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-slate-400">
                      {description}
                    </p>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </div>
    </section>
  );
}