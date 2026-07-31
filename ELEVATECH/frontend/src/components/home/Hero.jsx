import {
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
} from "lucide-react";

import heroImage from "../../assets/hero/hero-banner.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#07101D]">

      {/* Background Glow */}

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 opacity-20 blur-[180px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 py-24 relative">

        <div className="grid lg:grid-cols-2 items-center gap-20">

          {/* LEFT SIDE */}

          <div>

            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold">

              🚀 NEW ARRIVALS 2026

            </span>

            <h1 className="mt-8 text-5xl lg:text-7xl font-black leading-tight">

              Upgrade

              <br />

              Your Digital

              <span className="text-yellow-400">

                {" "}Lifestyle

              </span>

            </h1>

            <p className="mt-8 text-slate-300 text-lg leading-8 max-w-xl">

              Discover premium laptops,
              smartphones, printers,
              gaming accessories and office
              electronics from the world's
              leading brands.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <button className="bg-yellow-400 hover:bg-yellow-300 transition duration-300 text-black font-bold px-8 py-4 rounded-xl shadow-lg">

                Shop Now

              </button>

              <button className="border border-blue-500 hover:bg-blue-600 transition duration-300 px-8 py-4 rounded-xl flex items-center gap-3">

                Explore Deals

                <ArrowRight size={18} />

              </button>

            </div>

            {/* FEATURES */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14">

              <div className="flex items-center gap-3">

                <ShieldCheck
                  className="text-blue-400"
                  size={24}
                />

                <div>

                  <p className="font-semibold">

                    Secure Payment

                  </p>

                  <span className="text-sm text-gray-400">

                    Stripe & M-Pesa

                  </span>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Truck
                  className="text-blue-400"
                  size={24}
                />

                <div>

                  <p className="font-semibold">

                    Fast Delivery

                  </p>

                  <span className="text-sm text-gray-400">

                    Across Kenya

                  </span>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <CreditCard
                  className="text-blue-400"
                  size={24}
                />

                <div>

                  <p className="font-semibold">

                    Easy Checkout

                  </p>

                  <span className="text-sm text-gray-400">

                    Safe & Secure

                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="relative">

            <div className="absolute inset-0 bg-blue-500 blur-[140px] opacity-25 rounded-full"></div>

            <div className="relative rounded-3xl overflow-hidden">

              <img
                src={heroImage}
                alt="ElevaTech Hero"
                className="w-full h-[600px] object-contain"
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}