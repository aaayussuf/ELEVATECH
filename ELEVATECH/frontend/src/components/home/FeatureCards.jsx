import {
  Truck,
  ShieldCheck,
  BadgeCheck,
  RotateCcw,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Free shipping on orders above KSh 5,000",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "Protected payments with Stripe & M-Pesa",
  },
  {
    icon: BadgeCheck,
    title: "Genuine Products",
    description: "100% authentic products with warranty",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day hassle-free return policy",
  },
];

export default function FeatureCards() {
  return (
    <section className="bg-[#0B1628] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group bg-[#131F35] rounded-2xl border border-slate-700 p-8 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
              >

                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition">

                  <Icon
                    size={30}
                    className="text-blue-400 group-hover:text-white"
                  />

                </div>

                <h3 className="text-xl font-bold mb-3">

                  {feature.title}

                </h3>

                <p className="text-gray-400 leading-7">

                  {feature.description}

                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

